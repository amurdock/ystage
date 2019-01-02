import pipe from 'p-pipe'

import logger from './logger'
import configuration from './configuration'
import workspacesInfo from './workspaces'

export const defaultMiddleware = [configuration, logger, workspacesInfo]

export default pipe(...defaultMiddleware)
