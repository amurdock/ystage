import { join, relative } from 'path';
import { exec, pkg } from '../../utils';

const mapPackagePaths = (dependencies, workspaces) => {
  const { path: rootPath } = workspaces.find(({ root }) => root);

  return Object.entries(dependencies).reduce((accumulation, [key, value]) => {
    const { path } = workspaces.find(({name}) => name === key) || {};
    return {...accumulation, [key]: path ? `./${relative(rootPath, path)}` : value};
  }, {});
};

export const path = root => dependency => Promise.resolve(dependency.path
  ? dependency
  : {
    ...dependency,
    path: join(root, '.ystage', dependency.name)
  });

export const create = promise => promise
  .then(dependency => Promise.all([dependency, exec(`mkdir -p ${dependency.path}`)]))
  .then(([dependency]) => dependency);

export const seed = promise => promise
  .then(dependency => Promise.all([dependency, exec(`cp -r ${join(dependency.location, '*')} ${dependency.path}`)]))
  .then(([dependency]) => dependency);

export const transform = (promise, index, collection) => promise
  .then(async dependency => {
    const workspaces = await Promise.all(collection);

    const { path, workspaceDependencies } = dependency

    if (workspaceDependencies.length === 0) {
      return dependency;
    }

    const packagePath = join(path, 'package.json');
    const { dependencies = {}, devDependencies = {}, ...module } = await pkg.loadFromPath(packagePath);

    await pkg.saveToPath(packagePath, {
      ...module,
      dependencies: mapPackagePaths(dependencies, workspaces),
      devDependencies: mapPackagePaths(devDependencies, workspaces),
    })

    return dependency;
  });