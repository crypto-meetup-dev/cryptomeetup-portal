import Vue from 'vue';
import Vuex from 'vuex';


import mutations from './mutations';
import actions from './actions';

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
    lands: [],
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
  mutations,
  actions,
});
