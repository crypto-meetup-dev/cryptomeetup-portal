
// Use EOS Asia for Mainnet https://api1.eosasia.one'
export const eosOptions = {
  eosasia: {
    httpEndpoint: 'https://api.eosbeijing.one',
    verbose: true,
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  },
  kylin: {
    httpEndpoint: 'https://api-kylin.eosasia.one',
    verbose: true,
    chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
  },
  local: {
    httpEndpoint: 'http://127.0.0.1:8888',
    verbose: true,
    chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
  },
};

// Use CryptoKylin for Testnet
export const networks = {
  kylin: {
    protocol: 'https',
    blockchain: 'eos',
    host: 'api-kylin.eosasia.one',
    port: 443,
    chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
  },
  local: {
    blockchain: 'eos',
    host: '127.0.0.1',
    port: 8888,
    protocol: 'http',
    chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
    verbose: true,
    debug: true,
  },
  eosasia: {
    protocol: 'https',
    blockchain: 'eos',
    host: 'api.eosbeijing.one',
    port: 443,
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  },
};
