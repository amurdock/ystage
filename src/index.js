import yargs from 'yargs/yargs'
import { run } from './commands'

const main = argv => {
  const context = {}

  return yargs(argv)
    .usage('Usage: $0 <command> [options]')
    .demandCommand(
      1,
      'A command is required. Pass --help to see all available commands and options.'
    )
    .recommendCommands()
    .strict()
    .command(run)
    .fail((_, err) => {
      console.log('*** failed ***', _, err)
    })
    .parse(argv, context)
}

export default main
