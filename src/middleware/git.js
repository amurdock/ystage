import { proc } from '../utils'

const git = async argv => {
  const { gitDiff: commitSha, workspaces } = argv
  const locations = workspaces.map(({ location }) => location)

  if (!commitSha) {
    return {
      ...argv,
      filterPaths: locations
    }
  }

  const { stdout: result } = await proc.exec('git', [
    'diff',
    '--name-only',
    commitSha
  ])
  const paths = result.split('\n')
  const filterPaths = locations.filter(
    location => !!paths.find(path => path.startsWith(location))
  )
  return { ...argv, filterPaths }
}

export default git
