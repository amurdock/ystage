import middleware from '../middleware'
import { filter, proc, timer } from '../utils'

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
      }
    })
    .options({
      'include-dependencies': {
        group: 'Options:',
        describe: 'Include dependent packages',
        type: 'boolean',
        requiresArg: false,
        default: false
      }
    })

export const handler = async argv => {
  const { script, workspaces, logger, filterPaths } = await middleware(argv)

  const scriptFilter = filter.byScript(script)
  const pathFilter = filter.byPath(filterPaths)

  // / filter the workspaces based on `script` and `filter paths`
  let filteredWorkspaces = pathFilter(scriptFilter(workspaces))

  // / asked to include dependencies ... add them and don't forget to filter them based on `script`
  if (argv.includeDependencies) {
    filteredWorkspaces = filteredWorkspaces.reduce(
      (accumulation, { workspaceDependencies }) => [
        ...accumulation,
        ...scriptFilter(
          workspaceDependencies
            .map(name => workspaces.find(({ module }) => module.name === name))
            .filter(
              ({ module: outer }) =>
                !accumulation.find(
                  ({ module: inner }) => outer.name === inner.name
                )
            )
        )
      ],
      filteredWorkspaces
    )
  }

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
