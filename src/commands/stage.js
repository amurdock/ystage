import { configuration, workspacesInfo } from '../middleware'

export const command = 'stage <package-name>';

export const describe = 'Stage a workspace package';

export const builder = yargs =>
  yargs
    .positional('package', {
      describe: 'The package name (including scope), which must exist',
      type: 'string',
    });

export const middlewares = [
  configuration,
  workspacesInfo,
];

export const handler = argv => {
  const { packageName, workspaces } = argv;

  console.log('*** packageName ***', packageName);
  console.log('*** workspaces ***', workspaces);

  if (!workspaces[packageName]) {
    throw new Error('Invalid package');
  }

  console.log(argv);


};
