import { join } from 'path'
import { pkg, proc } from '../utils'

const loadModule = async location =>
  pkg.loadFromPath(join(location, 'package.json'))

const yarnWorkspaces = async () => {
  const { stdout: response } = await proc.exec('yarn', [
    'workspaces',
    'info',
    '--silent'
  ])

  const all = JSON.parse(response)

  // flatten workspaces and load their packages
  return Promise.all(
    Object.entries(all)
      .reduce(
        (accumulation, [, workspace]) => [...accumulation, { ...workspace }],
        []
      )
      .map(async workspace => {
        const module = await loadModule(workspace.location)
        return { module, ...workspace }
      })
  )
}

const stageWorkspaces = async ({ config }) => {
  const { stdout: response } = await proc.exec(
    'find',
    [join(config.stage.path, '*'), '-maxdepth 0', '-type d'],
    { shell: true }
  )

  return Promise.all(
    response.split(/\s/).map(async location => {
      const module = await loadModule(location)
      return {
        location,
        module,
        workspaceDependencies: [],
        mismatchedWorkspaceDependencies: []
      }
    })
  )
}

const workspaces = async argv => {
  const { stage } = argv
  const factory = stage ? stageWorkspaces : yarnWorkspaces
  const workspaces = await factory(argv)
  return { ...argv, workspaces }
}

export default workspaces
