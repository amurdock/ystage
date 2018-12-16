import { join, basename } from 'path';
import pipe from 'p-pipe';
import { configuration, workspacesInfo } from '../../middleware'
import { depends } from '../../utils';
import * as staging from './staging';

export const command = 'create <package-name>';

export const describe = 'Create a staged workspace package';

export const builder = yargs =>
  yargs
    .positional('package', {
      describe: 'The package name (including scope), which must exist',
      type: 'string',
    });

export const handler = async argv => {
  const env = await pipe(configuration, workspacesInfo)(argv);

  const { config, packageName, workspaces } = env;
  const { [packageName]: packageConfig } = workspaces
  if (!packageConfig) {
    throw new Error('Invalid package');
  }

  // define root path
  const path = join(config.stage.path, basename(packageConfig.location))

  await Promise.all(
    depends
      .build(workspaces, { name: packageName, root: true, path, ...packageConfig })
      .map(staging.path(path))
      .map(staging.create)
      .map(staging.seed)
      .map(staging.transform)
  );
};
