import log from 'npmlog'
import { name } from '../../package'

const logger = async argv => {
  const { log: logConfig = {} } = argv.config

  log.addLevel('success', 3001, { fg: 'green', bold: true })

  log.level = 'warn'
  log.heading = name

  if (logConfig.level) {
    log.level = logConfig.level
  }

  const logger = log.newGroup(name)

  return {
    ...argv,
    logger
  }
}

export default logger
