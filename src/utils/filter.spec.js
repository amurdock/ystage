import * as filter from './filter';

const functions = ['byPath', 'byPattern', 'byScript'];

describe('filter', () => {
  const allWorkspaces = ['a', 'b', 'c', 'd'].map(name => ({
    name: `@foo/bar-${name}`,
    location: `packages/module-${name}`,
    pkg: {
      scripts: {
        [name]: `echo ${name}`
      }
    }
  }));

  it('exposes the expected interface', () => {
    Object.entries(filter).forEach(([name, value]) => {
      expect(functions).toContain(name);
      expect(typeof value).toEqual('function');
    });
  });

  describe('byPath', () => {
    it('filters the workspaces', () => {
      const workspaces = filter.byPath(['packages/module-c/src/index.js'])(
        allWorkspaces
      );

      const [, , c] = allWorkspaces;
      const [module] = workspaces;
      expect(workspaces.length).toEqual(1);
      expect(module.location).toEqual(c.location);
    });
  });

  describe('byPattern', () => {
    it('filters the workspaces', () => {
      const workspaces = filter.byPattern('@+(foo|bar)/*+(a|c)')(allWorkspaces);

      const [a, , c] = allWorkspaces;
      const [aModule, cModule] = workspaces;
      expect(workspaces.length).toEqual(2);
      expect(aModule).toEqual(a);
      expect(cModule).toEqual(c);
    });
  });

  describe('byScript', () => {
    it('filters the workspaces', () => {
      const workspaces = filter.byScript('b')(allWorkspaces);

      const [, b] = allWorkspaces;
      const [bModule] = workspaces;
      expect(workspaces.length).toEqual(1);
      expect(bModule).toEqual(b);
    });
  });
});
