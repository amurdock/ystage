import { exec } from '../utils'

const workspaces = async () => {
  const workspaces = await exec('yarn workspaces info --silent', true);
  return { workspaces };
}

export default workspaces;