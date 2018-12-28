import middleware from '../middleware'
import { filter, proc } from '../utils'

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
  const { script, workspaces } = await middleware(argv)

  const filteredWorkspaces = filter.byScript(script)(workspaces)

  const chain = Promise.resolve()

  filteredWorkspaces.forEach(({ location: cwd }) =>
    chain.then(() =>
      proc.exec('yarn', ['run', script], { cwd, stdio: 'pipe', reject: false })
    )
  )

  chain.then(() => console.log('complete')).catch(err => console.log(err))
}
