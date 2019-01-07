import pipe from 'p-pipe'

import logger from './logger'
import configuration from './configuration'
import workspaces from './workspaces'
import git from './git'

export const defaultMiddleware = [configuration, logger, workspaces, git]

export default pipe(...defaultMiddleware)
