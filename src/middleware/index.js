import pipe from 'p-pipe';

import configuration from './configuration';
import workspacesInfo from './workspaces';

export const defaultMiddleware = [
  configuration,
  workspacesInfo,
];

export default pipe(...defaultMiddleware);
