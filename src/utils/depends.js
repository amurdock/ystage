export const build = (workspaces, { workspaceDependencies, ...workspace }, dependencies = []) => ([
  { ...workspace, workspaceDependencies },
  ...workspaceDependencies.reduce((accumulation, name) =>
    build(workspaces, { name, ...workspaces[name] }, accumulation),
    dependencies
  )
]);
