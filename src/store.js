import Vue from 'vue';
import Vuex from 'vuex';
import { Api, Rpc } from 'eosjs';
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs2';
import { getMyBalancesByContract } from './blockchain';
import { network, appScatterName } from './config';

Vue.use(Vuex);
const referral = localStorage.getItem('refferal') || null;

export default new Vuex.Store({
  state: {
    scatter: null,
    eos: null,
    referral,
    rpc: null,
    balance: {
      eos: '0.0000 EOS',
      hpy: '0.0000 HPY',
      kby: '0.0000 KBY',
    },
    lang: localStorage.getItem('lang') || 'ch',
    dataIsLoading: true,
    globalInfo: null,
  },
  getters: {
    account: ({ scatter }) => {
      if (!scatter) { return null; }
      const { identity } = scatter;
      return identity ? identity.accounts.find(({ blockchain }) => blockchain === 'eos') : null;
    },
    identity: ({ scatter }) => {
      if (!scatter) { return null; }
      const { identity } = scatter;
      return identity;
    },
  },
  mutations: {
    setScatter(state, scatter) {
      state.scatter = scatter;
      const rpc = new Rpc.JsonRpc(`${network.protocol}://${network.host}:${network.port}`);
      state.rpc = rpc;
      state.eos = scatter.eos(network, Api, { rpc });
    },
    setBalance(state, { symbol, balance }) {
      state.balance[symbol] = balance || `0.0000 ${symbol.toUpperCase()}`;
    },
    setDataLoading(state, loading) {
      state.dataIsLoading = loading;
    },
    setGlobal(state, globalInfo) {
      state.globalInfo = globalInfo;
    },
    changeLang(state, code) {
      state.lang = code;
    },
  },
  actions: {
    initScatter({ commit, dispatch }) {
      ScatterJS.plugins(new ScatterEOS());
      commit('setScatter', ScatterJS.scatter);
      dispatch('initScatterCore');
    },
    async initScatterCore({ commit, dispatch }) {
      try {
        const connected = await ScatterJS.scatter.connect(appScatterName, { initTimeout: 5000 });
        // User does not have Scatter Desktop, Mobile or Classic installed.
        if (!connected) return false;
        commit('setScatter', ScatterJS.scatter);
        window.ScatterJS = null;
        return true;
      } catch (err) {
        console.log(err);
        alert('Error happened, please make sure you\'re running Scatter Desktop.');
        return false;
      }
    },
    updateBalance({ commit }) {
      getMyBalancesByContract({ symbol: 'eos' })
        .then((price) => {
          commit('setBalance', { symbol: 'eos', balance: price[0] });
        });
      getMyBalancesByContract({ symbol: 'kby', tokenContract: 'dacincubator' })
        .then((price) => {
          commit('setBalance', { symbol: 'kby', balance: price[0] });
        });
      getMyBalancesByContract({ symbol: 'hpy', tokenContract: 'happyeosslot' })
        .then((price) => {
          commit('setBalance', { symbol: 'hpy', balance: price[0] });
        });
    },
    async initIdentity({ state, dispatch }) {
      const requiredFields = { accounts: [network] };
      await state.scatter.getIdentity(requiredFields);
      dispatch('updateBalance');
    },
    async forgetIdentity({ state }) {
      await state.scatter.forgetIdentity();
    },
  },
});
