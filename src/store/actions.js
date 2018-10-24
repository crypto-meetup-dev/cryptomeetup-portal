import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs2';
import { getMyBalancesByContract } from '@/blockchain';
import { network, appScatterName } from '@/config';

/*
    Before any move 在作出修改之前
    Read more about VueX action: https://vuex.vuejs.org/zh/guide/actions.html
    查阅更多关于 VueX 的 action: https://vuex.vuejs.org/zh/guide/actions.html
*/

export default {
  initEosTools({ commit, dispatch }) {
    commit('setEosRPC');
    ScatterJS.plugins(new ScatterEOS());
    commit('setScatter', ScatterJS.scatter);
    dispatch('initScatterCore');
    dispatch('fetchDatas');
  },
  async initScatterCore({ commit, dispatch }) {
    try {
      const connected = await ScatterJS.scatter.connect(appScatterName, { initTimeout: 5000 });
      // User does not have Scatter Desktop, Mobile or Classic installed.
      if (!connected) {
        commit('setIsScatterConnected', false);
        return false;
      } else {
        commit('setIsScatterConnected', true);
      }
      if (ScatterJS.scatter.identity) {
        console.info('User Logged in already, fetching balance');
        dispatch('updateBalance');
      }
      window.ScatterJS = null;
      return true;
    } catch (err) {
      console.log(err);
      alert('Error happened, please make sure you\'re running Scatter Desktop.');
      return false;
    }
  },
  async updateBalance({ commit }) {
    const contractBalances = await Promise.all([
      getMyBalancesByContract({ symbol: 'eos' }),
      // getMyBalancesByContract({ symbol: 'kby', tokenContract: 'dacincubator' }),
      // getMyBalancesByContract({ symbol: 'hpy', tokenContract: 'happyeosslot' }),
      getMyBalancesByContract({ symbol: 'cmu', tokenContract: 'dacincubator' }),
    ]);
    const [eos, kby, hpy, cmu] = contractBalances.flat();
    commit('setUserTokenBalance', { symbol: 'eos', balance: eos });
    commit('setUserTokenBalance', { symbol: 'kby', balance: kby });
    commit('setUserTokenBalance', { symbol: 'hpy', balance: hpy });
    commit('setUserTokenBalance', { symbol: 'cmu', balance: cmu });
  },
  async fetchLandsStatus({ state, commit }) {
    const { rows } = await state.rpc.get_table_rows({
      json: true,
      code: 'cryptomeetup',
      scope: 'cryptomeetup',
      table: 'land',
      limit: 256,
    });
    commit('updateLands', rows);
  },
  async fetchDatas({ dispatch }) {
    dispatch('fetchLandsStatus');
  },
  async initIdentity({ state, dispatch }) {
    const requiredFields = { accounts: [network] };
    await state.scatter.getIdentity(requiredFields);
    dispatch('updateBalance');
  },
  async forgetIdentity({ state }) {
    await state.scatter.forgetIdentity();
  },
};
