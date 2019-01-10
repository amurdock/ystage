import pipe from 'p-pipe'
import stage from './stage'
import middleware from '../../middleware'
import { workspace, proc, timer } from '../../utils'

const { filterByPath, filterByPattern } = workspace

export const command = 'stage'

export const describe = 'Create a staged workspace package(s)'

export const builder = yargs =>
  yargs.options({
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
    install: {
      group: 'Options:',
      describe: 'Once staged install dependencies i.e. `yarn install`',
      type: 'boolean',
      default: false,
      requiresArg: false
    }
  })

// when staging a module dependencies must always
// be included for the module to be consistent
const defaultArgs = { includeDependencies: true }

export const handler = async argv => {
  const ctx = await middleware({ ...argv, ...defaultArgs })
  const { workspaces, logger } = ctx

  // filter the workspaces
  const filteredRootWorkspaces = await pipe(
    filterByPath(ctx),
    filterByPattern(ctx)
  )(workspaces)

  const { length: count } = filteredRootWorkspaces
  logger.info('', 'Executing stage on %d packages', count)

  const elapsed = timer()

  const runs = filteredRootWorkspaces.reduce(
    (promiseChain, workspace) =>
      promiseChain.then(results =>
        Promise.all([...results, stage(workspace, ctx)])
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
        filteredRootWorkspaces
          .map(({ module }) => `- ${module.name}`)
          .join('\n')
      )
    })
    .catch(err => {
      process.exitCode = err.code
    })
}
