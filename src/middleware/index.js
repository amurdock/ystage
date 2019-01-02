import pipe from 'p-pipe'

import logger from './logger'
import configuration from './configuration'
import workspacesInfo from './workspaces'
import git from './git'

export const defaultMiddleware = [configuration, logger, workspacesInfo, git]

export default pipe(...defaultMiddleware)
