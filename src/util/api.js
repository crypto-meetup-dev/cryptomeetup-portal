import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import Eos from 'eosjs';
import * as config from '@/config';
import EosPriceFormatter from './eosPriceFormatter';

ScatterJS.plugins(new ScatterEOS());

// const eosRpc = new Rpc.JsonRpc(`${config.network.protocol}://${config.network.host}:${config.network.port}`);
// const eosApi = ScatterJS.scatter.eos(config.network, Api, { rpc: eosRpc });
const eos = ScatterJS.scatter.eos(config.network, Eos, { expireInSeconds: 60 });

const API = {
  async getMyStakedInfoAsync({ accountName }) {
    const { rows } = await eos.getTableRows({
      json: true,
      code: 'cryptomeetup',
      scope: accountName,
      table: 'voters',
      limit: 1024,
    });
    return rows;
  },
  async getLandsInfoAsync() {
    const { rows } = await eos.getTableRows({
      json: true,
      code: 'cryptomeetup',
      scope: 'cryptomeetup',
      table: 'land',
      limit: 256,
    });
    return rows;
  },
  async getMarketInfoAsync() {
    const { rows } = await eos.getTableRows({
      json: true,
      code: 'cryptomeetup',
      scope: 'cryptomeetup',
      table: 'market',
      limit: 256,
    });
    return rows;
  },
  async getBalancesByContract({ tokenContract = 'eosio.token', accountName, symbol }) {
    return eos.getCurrencyBalance(tokenContract, accountName, symbol);
  },
  getNextPrice(land) {
    return land.price * 1.4;
  },
  install(Vue) {
    Object.defineProperties(Vue.prototype, {
      $API: {
        get() {
          return API;
        },
      },
    });
  },
  connectScatterAsync() {
    return ScatterJS.scatter.connect(config.appScatterName, { initTimeout: 2000 });
  },
  loginScatterAsync() {
    const requiredFields = { accounts: [config.network] };
    return ScatterJS.scatter.getIdentity(requiredFields);
  },
  logoutScatterAsync() {
    return ScatterJS.scatter.forgetIdentity();
  },
  transferEOSAsync({
    from,
    to,
    memo = '',
    amount = 0,
  }) {
    console.log(ScatterJS.scatter.identity);
    return eos.transfer(
      from,
      to,
      EosPriceFormatter.formatPrice(amount),
      memo, {
        authorization: [`${from.name}@active`],
      });
  },
  async transferTokenAsync({
    from,
    to,
    memo = '',
    amount = 0,
    tokenContract = 'eosio.token',
  }) {
    const contract = await eos.contract(tokenContract);
    return contract.transfer(from,
      to,
      amount,
      memo, {
        authorization: [`${from.name}@active`],
      });
  },
};

export default API;
