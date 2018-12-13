import { join, basename } from 'path';
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

export const middlewares = [
  configuration,
  workspacesInfo,
];

export const handler = async ({ config, packageName, workspaces }) => {
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
