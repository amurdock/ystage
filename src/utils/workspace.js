import minimatch from 'minimatch'

export const filterByPath = ({ filterPaths }) => workspaces =>
  workspaces.filter(({ location }) =>
    filterPaths.some(path => path.startsWith(location))
  )

export const filterByPattern = ({ pattern: patterns }) => workspaces =>
  workspaces.filter(({ module }) =>
    patterns.some(pattern => minimatch(module.name, pattern))
  )

export const filterByScript = ({ script }) => workspaces =>
  workspaces.filter(({ module }) => !!module.scripts[script])

export const includeDependencies = ctx => workspaces => {
  const { includeDependencies: include } = ctx
  if (!include) {
    return workspaces
  }

  // / asked to include dependencies ... add them and don't forget to filter them based on `script`
  return workspaces.reduce(
    (accumulation, { workspaceDependencies }) => [
      ...accumulation,
      ...filterByScript(ctx)(
        workspaceDependencies
          .map(name => workspaces.find(({ module }) => module.name === name))
          .filter(
            ({ module: outer }) =>
              !accumulation.find(
                ({ module: inner }) => outer.name === inner.name
              )
          )
      )
    ],
    workspaces
  )
}
