import log from 'npmlog'
import { name } from '../../package'

const logger = async argv => {
  const { loglevel } = argv.config

  log.addLevel('success', 3001, { fg: 'green', bold: true })

  log.level = loglevel || 'warn'
  log.heading = name

  const logger = log.newGroup(name)

  return {
    ...argv,
    logger
  }
}

export default logger
