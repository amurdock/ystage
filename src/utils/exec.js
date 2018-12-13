import { exec as _exec } from 'child_process';
import { promisify } from 'util';

const exececute = promisify(_exec)

const exec = async (cmd, json = false) => {
  const { stdout: response } = await exececute(cmd);
  return json ? JSON.parse(response) : response
}

export default exec;