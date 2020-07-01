import Vue from 'vue';
import Vuex from 'vuex';
import { Toast } from 'buefy/dist/components/toast';
import Land from '@/util/land';
import getApi from '@/util/apis/index.js'
import ui from './ui';
import modules from '@/config/modules.js';
import Global from '@/Global.js';

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
    isLoggingIn: false,
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
    setIsLoggingIn(state, isLoggingIn) {
      state.isLoggingIn = isLoggingIn;
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
    async login() {
      console.log('logging...')
      return true
    },
    async logout() {
      console.log('logging out...')
      return true
    },
  },
});
