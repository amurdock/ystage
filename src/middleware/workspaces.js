import { exec } from '../utils';

const workspaces = async (argv) => {
  const workspaces = await exec('yarn workspaces info --silent', true);
  return { ...argv, workspaces };
};

export default workspaces;
