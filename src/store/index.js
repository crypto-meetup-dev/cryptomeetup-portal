import Vue from 'vue';
import Vuex from 'vuex';
import { Toast } from 'buefy/dist/components/toast';
import Land from '@/util/land';
import getApi from '@/util/apis/index.js'
import ui from './ui';
import modules from '@/config/modules.js';
import Global from '@/Global.js';
import modules from '@/config/modules.js';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    ui,
  },
  state: {
    modulesConfig: modules,
    contractType: 'eos',
    isScatterConnected: false,
    scatterAccount: null,
    portalInfoList: [],
    balances: {
      eos: '0 EOS',
      cmu: '0 CMU',
      bos: '0 BOS'
    },
    isScatterLoggingIn: false,
    isLoadingData: false,
    landInfo: {},
    landInfoUpdateAt: null,
    marketInfo: {},
    stakedInfo: { 
      staked: 0,
      refund: '0 CMU',
    },
    myCheckInStatus: [],
    globalInfo: null,
    dividendInfo: {
      land_profit: 0,
      ref_profit: 0,
      fee_profit: 0,
      pool_profit: 0,
      staked_income: 0,
      council_income: 0,
    },
  },
  mutations: {
    setContractType(state, type) {
      state.contractType = type
    },
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
    setMyCheckInStatus(state, status) {
      state.myCheckInStatus = status;
    },
    setPortalInfoList(state, portalInfoList) {
      Global.setPortalInfoList(portalInfoList)
      state.portalInfoList = portalInfoList
    }
  },
  actions: {
    updateContractType({ commit, dispatch }, type) {
      commit('setContractType', type);
      dispatch('logoutScatterAsync');
      setTimeout(() => {
        dispatch('connectScatterAsync')
      }, 0);
    },
    async connectScatterAsync({ commit, dispatch, state }) {
      console.log('Connecting to Scatter desktop...');
      const connected = await getApi(Global.contractType).api.connectScatterAsync();
      console.log('Connect Scatter result: ', connected);
      if (connected) {
        commit('setIsScatterConnected', true);
        if (getApi(Global.contractType).currentEOSAccount()) {
          commit('setScatterAccount', getApi(Global.contractType).currentEOSAccount());
          dispatch('getMyBalances');
          dispatch('getPortalInfo');
          dispatch('getMyStakedInfo');
          dispatch('getPlayerInfo');
          dispatch('updateMyCheckInStatus');
        }
      }
    },
    async getMyBalances({ commit, state }) {
      const { name } = state.scatterAccount;
      const contractType = Global.contractType;
      if (contractType) {
        const balances = await Promise.all([
          getApi(contractType).api.getBalancesByContract({ symbol: contractType === 'eos' ? 'eos' : 'BOS', accountName: name }),
          getApi(contractType).api.getBalancesByContract(contractType === 'eos' ? {
            symbol: 'cmu', accountName: name, contractType
          } : {
            symbol: 'CMU', accountName: name, contractType
          })
        ]);
        const eos = balances[0][0];
        const cmu = balances[1][0];
        commit('setMyBalance', { symbol: Global.contractType, balance: eos });
        commit('setMyBalance', { symbol: 'cmu', balance: cmu });
      }
    },
    async updateLandInfoAsync({ commit, state }) {
      commit('setIsLoadingData', true);
      try {
        const landInfo = {};
        const rows = await getApi(Global.contractType).api.getLandsInfoAsync();
        rows.forEach((row) => {
          const countryCode = Land.landIdToCountryCode(row.id);
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
    async updateMarketInfoAsync({ commit, state }) {
      try {
        const marketInfoTable = await getApi(Global.contractType).api.getMarketInfoAsync();
        const marketInfo = marketInfoTable[0];
        marketInfo.coin_price = `${((parseFloat(marketInfo.supply.split(' ')[0])) / 10000000000).toDecimal(4).toString()} ${Global.contractType.toUpperCase()}`;
        marketInfo.supply = `${(parseFloat(marketInfo.supply.split(' ')[0]) - 40000000).toDecimal(4).toString()} CMU`;
        // price, balance, coin_price
        console.log(marketInfo, Global.contractType, 'marketInfo')
        commit('setMarketInfo', marketInfo);
      } catch (err) {
        console.error('Failed to fetch market info', err);
      }
    },
    async getMyStakedInfo({ commit, state }) {
      try {
        const stakedInfoList = await getApi(Global.contractType).api.getMyStakedInfoAsync({ accountName: state.scatterAccount.name });
        const refund = await getApi(Global.contractType).api.getRefund();
        stakedInfoList[0].refund = (refund.amount || '0 CMU');
        if (stakedInfoList[0] == null) {
          commit('setStakedInfo', { to: '', staked: 0 });
        } else {
          commit('setStakedInfo', stakedInfoList[0]);
        }
      } catch (err) {
        console.error('Failed to fetch staked info', err);
      }
    },
    async updateMyCheckInStatus({ commit, state }) {
      const status = await getApi(Global.contractType).api.getMyCheckInStatus({ accountName: state.scatterAccount.name });
      commit('setMyCheckInStatus', status);
    },
    async getPlayerInfo({ commit, state }) {
      try {
        const playerInfoList = await getApi(Global.contractType).api.getPlayerInfoAsync({ accountName: state.scatterAccount.name });
        if (playerInfoList[0] == null) {
          commit('setDividendInfo', {
            land_profit: 0,
            ref_profit: 0,
            fee_profit: 0,
            pool_profit: 0,
            staked_income: 0,
            council_income: 0,
          });
        } else {
          commit('setDividendInfo', playerInfoList[0]);
        }
      } catch (err) {
        console.error('Failed to fetch pool_profit', err);
      }
    },
    async getGlobalInfo({ commit, state }) {
      try {
        const globalInfoList = await getApi(Global.contractType).api.getGlobalInfoAsync();        
        commit('setGlobalInfo', globalInfoList[0]);
      } catch (err) {
        console.error('Failed to fetch staked info', err);
      }
    },
    async getPortalInfo({ commit, state }) {
      try {
        const portalInfoList = await getApi(Global.contractType).api.getPortalInfoAsync();
        commit('setPortalInfoList', portalInfoList);
      } catch (err) {
        console.error('Failed to fetch staked info', err);
      }
    },
    async loginScatterAsync({ commit, dispatch, state }) {
      commit('setIsScatterLoggingIn', true);
      try {
        const identity = await getApi(Global.contractType).api.loginScatterAsync();
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
        dispatch('getPlayerInfo');
        dispatch('getPortalInfo')
      } catch (err) {
        console.error('Failed to login Scatter', err);
        Toast.open({
          message: `Failed to login Scatter: ${err.message}.`,
          type: 'is-danger',
          queue: false,
          duration: 5000,
        });
      }
      commit('setIsScatterLoggingIn', false);
    },
    async logoutScatterAsync({ commit }) {
      try {
        await getApi(Global.contractType).api.logoutScatterAsync();
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
