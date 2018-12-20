import { readFile, writeFile } from 'fs';
import { promisify } from 'util';

const readTextFile = promisify(readFile);
const writeTextFile = promisify(writeFile);

export const loadFromPath = async (path) => {
  const text = await readTextFile(path, 'utf8');
  return JSON.parse(text);
};

export const saveToPath = async (path, module) => writeTextFile(path, JSON.stringify(module, null, 2));
