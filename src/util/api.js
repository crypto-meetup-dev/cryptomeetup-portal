import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import Eos from 'eosjs';
import * as config from '@/config';
import PriceFormatter from './priceFormatter';

ScatterJS.plugins(new ScatterEOS());

function getInviteCode () {
  const inviteArr = window.location.hash.split('/invite/')
  return inviteArr.length === 2 ? inviteArr[1] : ''
}

// api https://get-scatter.com/docs/api-create-transaction

// @trick: use function to lazy eval Scatter eos, in order to avoid no ID problem.
const eos = () => ScatterJS.scatter.eos(config.network.eos, Eos, { expireInSeconds: 60 });
const currentEOSAccount = () => ScatterJS.scatter.identity && ScatterJS.scatter.identity.accounts.find(x => x.blockchain === 'eos');

const API = {
  async getMyStakedInfoAsync({ accountName }) {
    const { rows } = await eos().getTableRows({
      json: true,
      code: 'cryptomeetup',
      scope: accountName,
      table: 'voters',
      limit: 1024,
    });
    return rows;
  },
  async getPlayerInfoAsync({ accountName }) {
    const { rows } = await eos().getTableRows({
      json: true,
      code: 'cryptomeetup',
      scope: accountName,
      table: 'players',
      limit: 1024,
    });
    return rows;
  },
  async getBalancesByContract({ tokenContract = 'eosio.token', accountName, symbol }) {
    return eos().getCurrencyBalance(tokenContract, accountName, symbol);
  },
  async getRefund() {
    const { rows } = await eos().getTableRows({
      json: true,
      code: 'cryptomeetup',
      scope: currentEOSAccount().name,
      table: 'refunds',
      limit: 256,
    });
    return rows;
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
  transferEOSAsync({
    to,
    memo = '',
    amount = 0,
  }) {
    return eos().transfer(
      currentEOSAccount().name,
      to,
      PriceFormatter.formatPrice(amount),
      getInviteCode() ? `${memo} ${getInviteCode()}` : memo, {
        authorization: [`${currentEOSAccount().name}@${currentEOSAccount().authority}`],
      },
    );
  },
  async transferTokenAsync({
    to,
    memo = '',
    amount = 0,
    tokenContract = 'eosio.token',
  }) {
    const contract = await eos().contract(tokenContract);

    return contract.transfer(
      currentEOSAccount().name,
      to,
      amount,
      getInviteCode() ? `${memo} ${getInviteCode()}` : memo, {
        authorization: [`${currentEOSAccount().name}@${currentEOSAccount().authority}`],
      },
    );
  },
  async voteAsync({
    to,
    tokenContract = 'cryptomeetup',
  }) {
    const contract = await eos().contract(tokenContract);
    return contract.vote(
      currentEOSAccount().name,
      to, {
        authorization: [`${currentEOSAccount().name}@${currentEOSAccount().authority}`],
      },
    );
  },
  async stakeCMUAsync({
    to,
    memo = '',
    amount = 0,
    tokenContract = 'dacincubator',
  }) {
    const contract = await eos().contract(tokenContract);
    return contract.transfer(
      currentEOSAccount().name,
      to,
      amount,
      getInviteCode() ? `${memo} ${getInviteCode()}` : memo, {
        authorization: [`${currentEOSAccount().name}@${currentEOSAccount().authority}`],
      },
    );
  },
  async getCheckInRedeemCodeAsync() {
    const sha256lib = await import('js-sha256');
    const token = String(Math.floor(Math.random() * 0xFFFFFF));
    return sha256lib.sha256(token).slice(0, 10);
  },
  async redeemCodeAsync({ code }) {
    if (code.length !== 10) {
      throw new Error('Invalid redeem code');
    }
    const contract = await eos().contract('cryptomeetup');
    return contract.checkin(
      currentEOSAccount().name,
      '0196d5b5d9ec1bc78ba927d2db2cb327d836f002601c77bd8c3f144a07ddc737',
      { authorization: [`${currentEOSAccount().name}@${currentEOSAccount().authority}`] },
    );
  },
  async getMyCheckInStatus({ accountName }) {
    const { rows } = await eos().getTableRows({
      json: true,
      code: 'cryptomeetup',
      scope: accountName,
      table: 'checkins',
      limit: 1024,
    });
    return rows;
  },
};

export default API;
export { eos, currentEOSAccount };
