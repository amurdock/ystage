import cosmiconfig from 'cosmiconfig'
import { name } from '../../package'

const explorer = cosmiconfig(name)

const configuration = async argv => {
  const { config } = await explorer.search()

  return {
    ...argv,
    config: {
      log: {
        level: 'info'
      },
      stage: {
        path: './.stage'
      },
      ...config
    }
  }
}

export default configuration
