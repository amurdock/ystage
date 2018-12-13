import yargs from 'yargs/yargs';
import { stage } from './commands'

const main = argv => {
  const context = {};

  return yargs(argv)
    .usage('Usage: $0 <command> [options]')
    .demandCommand(1, 'A command is required. Pass --help to see all available commands and options.')
    .recommendCommands()
    .strict()
    .command(stage)
    .fail((_, err, yargs) => {
      console.log('*** failed ***', err);
    })
    .parse(argv, context);
};

export default main;
