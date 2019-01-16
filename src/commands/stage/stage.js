import { join, relative } from 'path'
import series from 'p-series'
import { proc, pkg } from '../../utils'

const basename = name => name.replace('@', '').replace('/', '-')

const findByName = (workspaces, name) =>
  workspaces.find(({ module }) => module.name === name)

const flatten = (workspaces, { workspaceDependencies }) =>
  workspaceDependencies
    .map(name => findByName(workspaces, name))
    .reduce(
      (acc, workspace) => [...acc, ...flatten(workspaces, workspace)],
      workspaceDependencies
    )

const resolvePackagePaths = (dependencies, locations, root) =>
  Object.entries(dependencies).reduce(
    (acc, [name, value]) => ({
      ...acc,
      [name]: locations[name]
        ? `./${relative(locations[root], locations[name])}`
        : value
    }),
    {}
  )

const stage = async (workspace, ctx, root) => {
  const { module, location: cwd } = workspace
  const { config } = ctx
  const { name, version } = module

  const base = join(process.cwd(), config.path, basename(root))
  const location =
    root === name ? base : join(base, config.path, basename(name))
  const filename = join(location, `${basename(name)}-v${version}.tgz`)

  await series([
    () => proc.exec('rm', ['-rf', location]),
    () => proc.exec('mkdir', ['-p', location]),
    () => proc.exec('yarn', ['pack', '--filename', filename], { cwd }),
    () =>
      proc.exec('tar', [
        '-xvf',
        filename,
        '-C',
        location,
        '--strip-components=1'
      ]),
    () => proc.exec('rm', [filename])
  ])

  return {
    name,
    location
  }
}

const transform = async (workspaceDependencies, locations, root) =>
  await Promise.all(
    workspaceDependencies.map(async workspace => {
      const { module } = workspace
      await pkg.saveToPath(join(locations[module.name], 'package.json'), {
        ...module,
        dependencies: resolvePackagePaths(module.dependencies, locations, root),
        devDependencies: resolvePackagePaths(
          module.devDependencies,
          locations,
          root
        )
      })
    })
  )

const stageWorkSpace = async (workspace, ctx) => {
  const { workspaces } = ctx
  const { name } = workspace.module

  const workspaceDependencies = [
    ...Array.from(new Set(flatten(workspaces, workspace))).map(name =>
      findByName(workspaces, name)
    ),
    workspace
  ]

  // stage root workspaces
  const { location: cwd } = await stage(workspace, ctx, name)

  // stage dependent workspaces
  const locationsAsArray = await Promise.all(
    workspaceDependencies.map(async workspace => stage(workspace, ctx, name))
  )

  const locations = locationsAsArray.reduce(
    (acc, { name, location }) => ({ ...acc, [name]: location }),
    {}
  )

  // transform workspaces
  await transform(workspaceDependencies, locations, name)

  if (!ctx.install) {
    return
  }

  return proc.spawn('yarn', ['install', '--no-lockfile', '--production=true'], {
    cwd,
    stdio: 'pipe',
    reject: true
  })
}

export default stageWorkSpace
