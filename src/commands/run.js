import pipe from 'p-pipe'
import middleware from '../middleware'
import { workspace, proc, timer } from '../utils'

const {
  filterByScript,
  filterByPath,
  filterByPattern,
  includeDependencies
} = workspace

export const command = 'run <script>'

export const describe =
  'Run a yarn script in each package that contains that script'

export const builder = yargs =>
  yargs
    .example(
      '$0 run build -- --silent',
      '# `yarn run build --silent` in all packages with a build script'
    )
    .positional('script', {
      describe: 'The yarn script to run. Pass flags to send to yarn after --',
      type: 'string'
    })
    .options({
      'git-diff <commit-sha>': {
        group: 'Options:',
        describe: 'Include only packages defined within the `git diff`',
        type: 'string',
        requiresArg: true
      },
      'match-pattern': {
        alias: 'pattern',
        group: 'Options:',
        describe: 'Include packages whose name matches the supplied pattern(s)',
        type: 'array',
        requiresArg: true
      },
      'include-dependencies': {
        group: 'Options:',
        describe: 'Include dependent packages',
        type: 'boolean',
        requiresArg: false
      },
      stage: {
        group: 'Options:',
        describe: 'Run the command within the scope of the staging area',
        type: 'boolean',
        requiresArg: false,
        conflicts: ['git-diff', 'match-pattern', 'include-dependencies']
      }
    })

export const handler = async argv => {
  const ctx = await middleware(argv)
  const { script, workspaces, logger } = ctx

  // filter the workspaces
  const filteredWorkspaces = await pipe(
    filterByPath(ctx),
    filterByPattern(ctx),
    includeDependencies(ctx),
    filterByScript(ctx)
  )(workspaces)

  const { length: count } = filteredWorkspaces
  logger.info('', 'Executing command in %d packages: %j', count, script)

  const elapsed = timer()

  const runs = filteredWorkspaces.reduce(
    (promiseChain, { location: cwd }) =>
      promiseChain.then(results =>
        Promise.all([
          ...results,
          proc.spawn('yarn', ['run', script], {
            cwd,
            stdio: 'pipe',
            reject: true
          })
        ])
      ),
    Promise.resolve([])
  )

  runs
    .then(() => {
      logger.success(
        '',
        "Ran npm script '%s' in %d packages in %ss:",
        script,
        count,
        elapsed()
      )

      logger.success(
        '',
        filteredWorkspaces.map(({ module }) => `- ${module.name}`).join('\n')
      )
    })
    .catch(err => {
      process.exitCode = err.code
    })
}
