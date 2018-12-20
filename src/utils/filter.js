import minimatch from 'minimatch';

export const byPath = paths => workspaces =>
  workspaces.filter(({ location }) =>
    paths.some(path => path.startsWith(location))
  );

export const byPattern = (...patterns) => workspaces =>
  workspaces.filter(({ name }) =>
    patterns.some(pattern => minimatch(name, pattern))
  );

export const byScript = scriptName => workspaces =>
  workspaces.filter(({ pkg }) => !!pkg.scripts[scriptName]);
