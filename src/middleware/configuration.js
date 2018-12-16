import cosmiconfig from 'cosmiconfig';
import { name } from '../../package';

const explorer = cosmiconfig(name);

const configuration = async argv => ({
  ...argv,
  ...await explorer.search()
});

export default configuration;