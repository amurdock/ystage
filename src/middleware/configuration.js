import cosmiconfig from 'cosmiconfig';

const explorer = cosmiconfig('boo');

const configuration = async () => {
  const result = await explorer.search();
  console.log('*** result ***', result);
  return {};
}

export default configuration;