import middleware from '../middleware'
import { filter, proc } from '../utils'

export const command = 'run <script>';

export const describe = 'Run a yarn script in each package that contains that script';

export const builder = yargs =>
  yargs
    .example('$0 run build -- --silent', '# `yarn run build --silent` in all packages with a build script')
    .positional('script', {
      describe: 'The yarn script to run. Pass flags to send to yarn after --',
      type: 'string',
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

  // for each module run the
  const runnableWorkspaces = filter.byScript(script)(workspaces)

  const results = await Promise.all(
    runnableWorkspaces.map(({ location: cwd }) =>
      proc.exec('yarn', ['run', script], { cwd, reject: false })
    )
  )

  console.log(results)
}
