import cosmiconfig from 'cosmiconfig';
import { name } from '../../package';

const explorer = cosmiconfig(name);

const configuration = () => explorer.search();

export default configuration;