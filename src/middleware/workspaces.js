import { join } from 'path'
import { pkg, proc } from '../utils'

const workspaces = async argv => {
  const { stdout: response } = await proc.exec('yarn', [
    'workspaces',
    'info',
    '--silent'
  ])
  const all = JSON.parse(response)

  // flatten workspaces and load their packages
  const workspaces = await Promise.all(
    Object.entries(all)
      .reduce(
        (accumulation, [, workspace]) => [...accumulation, { ...workspace }],
        []
      )
      .map(async workspace => {
        const module = await pkg.loadFromPath(
          join(workspace.location, 'package.json')
        )
        return { module, ...workspace }
      })
  )

  return { ...argv, workspaces }
}

export default workspaces
