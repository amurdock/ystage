import pipe from 'p-pipe'
import middleware from '../../middleware'

export const command = 'run <script>';

export const describe = 'Run a yarn script in each package that contains that script';

exports.builder = yargs =>
  yargs
    .example('$0 run build -- --silent', '# `npm run build --silent` in all packages with a build script')
    .positional('script', {
      describe: 'The yarn script to run. Pass flags to send to yarn after --',
      type: 'string',
    })
    .options({
      'git-diff <commit-sha>': {
        group: 'Command Options:',
        describe: 'Include only packages defined within the `git diff`',
        type: 'string',
        requiresArg: true,
      },
    })

export const handler = async argv => {
  const env = await middleware(argv)
  console.log('*** run ***', env)
}
