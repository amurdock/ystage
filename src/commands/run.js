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
// .options({
//   'git-diff <commit-sha>': {
//     group: 'Command Options:',
//     describe: 'Include only packages defined within the `git diff`',
//     type: 'string',
//     requiresArg: true,
//   },
// })

export const handler = async argv => {
  const { script, workspaces, logger } = await middleware(argv)

  const filteredWorkspaces = filter.byScript(script)(workspaces)
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
