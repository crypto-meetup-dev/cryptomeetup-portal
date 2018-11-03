import Vue from 'vue';
import Vuex from 'vuex';
import { Toast } from 'buefy/dist/components/toast';
import Geo from '@/util/geo';
import API from '@/util/api';
import ui from './ui';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    ui,
  },
  state: {
    isScatterConnected: false,
    scatterAccount: null,
    balances: {
      eos: '0 EOS',
      cmu: '0 CMU',
    },
    isScatterLoggingIn: false,
    isLoadingData: false,
    landInfo: {},
    landInfoUpdateAt: null,
    marketInfo: {},
    stakedInfo: { staked: 0 },
    globalInfo: null,
    dividendInfo: { dividend: 0 },
  },
  mutations: {
    setLandInfo(state, landInfo) {
      state.landInfo = landInfo;
      state.landInfoUpdateAt = new Date();
    },
    setMarketInfo(state, marketInfo) {
      state.marketInfo = marketInfo;
    },
    setStakedInfo(state, stakedInfo) {
      state.stakedInfo = stakedInfo;
    },
    setGlobalInfo(state, globalInfo) {
      state.globalInfo = globalInfo;
    },
    setIsScatterLoggingIn(state, isScatterLoggingIn) {
      state.isScatterLoggingIn = isScatterLoggingIn;
    },
    setIsLoadingData(state, isLoadingData) {
      state.isLoadingData = isLoadingData;
    },
    setIsScatterConnected(state, isScatterConnected) {
      state.isScatterConnected = isScatterConnected;
    },
    setScatterAccount(state, account) {
      state.scatterAccount = account;
    },
    setMyBalance(state, { symbol, balance }) {
      state.balances[symbol] = balance;
    },
    setDividendInfo(state, dividendInfo) {
      state.dividendInfo = dividendInfo;
    },
  },
  actions: {
    async connectScatterAsync({ commit }) {
      console.log('Connecting to Scatter desktop...');
      const connected = await API.connectScatterAsync();
      console.log('Connect Scatter result: ', connected);
      if (connected) {
        commit('setIsScatterConnected', true);
      }
    },
    async getMyBalances({ commit, state }) {
      const { name } = state.scatterAccount;
      const balances = await Promise.all([
        API.getBalancesByContract({ symbol: 'eos', accountName: name }),
        API.getBalancesByContract({ symbol: 'cmu', accountName: name, tokenContract: 'dacincubator' }),
      ]);
      const [eos, cmu] = balances.flat();
      commit('setMyBalance', { symbol: 'eos', balance: eos });
      commit('setMyBalance', { symbol: 'cmu', balance: cmu });
    },
    async updateLandInfoAsync({ commit }) {
      commit('setIsLoadingData', true);
      try {
        const landInfo = {};
        const rows = await API.getLandsInfoAsync();
        rows.forEach((row) => {
          const countryCode = Geo.landIdToCountryCode(row.id);
          landInfo[countryCode] = {
            ...row,
            code: countryCode,
          };
        });
        commit('setLandInfo', landInfo);
      } catch (err) {
        console.error('Failed to fetch land info', err);
      }
      commit('setIsLoadingData', false);
    },
    async updateMarketInfoAsync({ commit }) {
      try {
        const marketInfoTable = await API.getMarketInfoAsync();
        const marketInfo = marketInfoTable[0];
        marketInfo.coin_price = `${((parseFloat(marketInfo.supply.split(' ')[0])) / 10000000000).toFixed(4).toString()} EOS`;
        marketInfo.supply = `${(parseFloat(marketInfo.supply.split(' ')[0]) - 40000000).toFixed(4).toString()} CMU`;
        // price, balance, coin_price
        commit('setMarketInfo', marketInfo);
      } catch (err) {
        console.error('Failed to fetch market info', err);
      }
    },
    async getMyStakedInfo({ commit, state }) {
      try {
        const stakedInfoList = await API.getMyStakedInfoAsync({ accountName: state.scatterAccount.name });
        if (stakedInfoList[0] == null) {
          commit('setStakedInfo', { to: '', staked: 0 });
        } else {
          commit('setStakedInfo', stakedInfoList[0]);
        }
      } catch (err) {
        console.error('Failed to fetch staked info', err);
      }
    },
    async getPlayerInfo({ commit, state }) {
      try {
        const playerInfoList = await API.getPlayerInfoAsync({ accountName: state.scatterAccount.name });
        if (playerInfoList[4] == null) {
          commit('setDividendInfo', { to: '', staked: 0 });
        } else {
          commit('setDividendInfo', stakedInfoList[4]);
        }
      } catch (err) {
        console.error('Failed to fetch pool_profit', err);
      }
    },
    async getGlobalInfo({ commit }) {
      try {
        const globalInfoList = await API.getGlobalInfoAsync();
        commit('setGlobalInfo', globalInfoList[0]);
      } catch (err) {
        console.error('Failed to fetch staked info', err);
      }
    },
    async loginScatterAsync({ commit, dispatch }) {
      commit('setIsScatterLoggingIn', true);
      try {
        const identity = await API.loginScatterAsync();
        if (!identity) {
          commit('setScatterAccount', null);
          return;
        }
        const account = identity.accounts.find(({ blockchain }) => blockchain === 'eos');
        commit('setScatterAccount', account);
        Toast.open({
          message: 'You successfully logged in Scatter!',
          type: 'is-success',
          queue: false,
        });
        dispatch('getMyBalances');
        dispatch('getMyStakedInfo');
      } catch (err) {
        console.error('Failed to login Scatter', err);
        Toast.open({
          message: `Failed to log in Scatter: ${err.message}.`,
          type: 'is-danger',
          queue: false,
          duration: 5000,
        });
      }
      commit('setIsScatterLoggingIn', false);
    },
    async logoutScatterAsync({ commit }) {
      try {
        await API.logoutScatterAsync();
      } catch (err) {
        console.error('Failed to logout Scatter', err);
      }
      commit('setScatterAccount', null);
      Toast.open({
        message: 'You successfully logged out!',
        type: 'is-success',
        queue: false,
      });
    },
  },
});
