import { exec as _exec } from 'child_process';
import { promisify } from 'util';

const execute = promisify(_exec);

const exec = async (cmd, json = false) => {
  const { stdout: response } = await execute(cmd);
  return json ? JSON.parse(response) : response;
};

export default exec;
