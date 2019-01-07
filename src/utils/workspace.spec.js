import * as workspace from './workspace'

const functions = [
  'filterByPath',
  'filterByPattern',
  'filterByScript',
  'includeDependencies'
]

describe('workspace', () => {
  const allWorkspaces = ['a', 'b', 'c', 'd'].map(name => ({
    location: `packages/module-${name}`,
    module: {
      name: `@foo/bar-${name}`,
      scripts: {
        [name]: `echo ${name}`
      }
    }
  }))

  it('exposes the expected interface', () => {
    Object.entries(workspace).forEach(([name, value]) => {
      expect(functions).toContain(name)
      expect(typeof value).toEqual('function')
    })
  })

  describe('filterByPath', () => {
    it('filters the workspaces', () => {
      const workspaces = workspace.filterByPath({
        filterPaths: ['packages/module-c/src/index.js']
      })(allWorkspaces)

      const [, , c] = allWorkspaces
      const [module] = workspaces
      expect(workspaces.length).toEqual(1)
      expect(module.location).toEqual(c.location)
    })
  })

  describe('filterByPattern', () => {
    it('filters the workspaces', () => {
      const workspaces = workspace.filterByPattern({
        pattern: ['@+(foo|bar)/*+(a|c)']
      })(allWorkspaces)

      const [a, , c] = allWorkspaces
      const [aModule, cModule] = workspaces
      expect(workspaces.length).toEqual(2)
      expect(aModule).toEqual(a)
      expect(cModule).toEqual(c)
    })
  })

  describe('filterByScript', () => {
    it('filters the workspaces', () => {
      const workspaces = workspace.filterByScript({ script: 'b' })(
        allWorkspaces
      )

      const [, b] = allWorkspaces
      const [bModule] = workspaces
      expect(workspaces.length).toEqual(1)
      expect(bModule).toEqual(b)
    })
  })
})
