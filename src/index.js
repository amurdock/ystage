import yargs from 'yargs/yargs'
import log from 'npmlog'
import { run } from './commands'

const main = argv => {
  const context = {}
  const cli = yargs(argv)

  return cli
    .usage('Usage: $0 <command> [options]')
    .demandCommand(
      1,
      'A command is required. Pass --help to see all available commands and options.'
    )
    .recommendCommands()
    .strict()
    .command(run)
    .fail((msg, err) => {
      const actual = err || new Error(msg)

      if (actual.name !== 'ValidationError') {
        if (/Did you mean/.test(actual.message)) {
          log.error('ystage', `Unknown command "${cli.parsed.argv._[0]}"`)
        }

        log.error('ystage', actual.message)
      }

      cli.exit(actual.code || 1, actual)
    })
    .parse(argv, context)
}

export default main
