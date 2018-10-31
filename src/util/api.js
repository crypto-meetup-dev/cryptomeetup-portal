import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs2';
import { Api, Rpc } from 'eosjs';
import * as config from '@/config';
import EosPriceFormatter from './eosPriceFormatter';

ScatterJS.plugins(new ScatterEOS());

const eosRpc = new Rpc.JsonRpc(`${config.network.protocol}://${config.network.host}:${config.network.port}`);
const eosApi = ScatterJS.scatter.eos(config.network, Api, { rpc: eosRpc });

const API = {
  async getMyStakedInfoAsync({accountName}) {
    const { rows } = await eosRpc.get_table_rows({
      json: true,
      code: 'cryptomeetup',
      scope: accountName,
      table: 'voters',
      limit: 1024,
    });
    return rows;
  },
  async getLandsInfoAsync() {
    const { rows } = await eosRpc.get_table_rows({
      json: true,
      code: 'cryptomeetup',
      scope: 'cryptomeetup',
      table: 'land',
      limit: 256,
    });
    return rows;
  },
  async getMarketInfoAsync() {
    const { rows } = await eosRpc.get_table_rows({
      json: true,
      code: 'cryptomeetup',
      scope: 'cryptomeetup',
      table: 'market',
      limit: 256,
    });
    return rows;
  },
  async getBalancesByContract({ tokenContract = 'eosio.token', accountName, symbol }) {
    return eosRpc.get_currency_balance(tokenContract, accountName, symbol);
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
    return eosApi.transact({
      actions: [{
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
          actor: from,
          permission: 'active',
        }],
        data: {
          from,
          to,
          quantity: EosPriceFormatter.formatPrice(amount),
          memo,
        },
      }],
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    });
  },
  transferTokenAsync({
    from,
    to,
    memo = '',
    amount = 0,
    tokenContract = 'eosio.token',
  }) {
    return eosApi.transact({
      actions: [{
        account: tokenContract,
        name: 'transfer',
        authorization: [{
          actor: from,
          permission: 'active',
        }],
        data: {
          from,
          to,
          quantity: amount,
          memo,
        },
      }],
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    });
  },
};

export default API;
