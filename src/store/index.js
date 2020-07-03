import Vue from 'vue';
import Vuex from 'vuex';
import { Toast } from 'buefy/dist/components/toast';
import Land from '@/util/land';
import getApi from '@/util/apis/index.js'
import ui from './ui';
import modules from '@/config/modules.js';
import Global from '@/Global.js';
import { loginWithEmail, getUserProfile, getAvatarUrl } from '../api/login'
import { setCookie, disassemble, removeCookie, clearAllCookie } from '../util/cookies'
import { uniqueId } from 'lodash';
import Axios from 'axios';

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
    userProfile: {
      id: 0
    }
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
    },
    setUserProfile(state, userProfile) {
      state.userProfile = userProfile
    }
  },
  actions: {
    async login({commit}, data) {
      const res = await loginWithEmail(data.email, data.password)
      const accessToken = res.data
      setCookie('cryptomeetuptoken', accessToken)
      const user = disassemble(accessToken);
      /**
       * user.iss: "username"
       * user.exp: 1594276659373
       * user.platform "email"
       * user.id 0
       */
      const res2 = await getUserProfile(user.id)
      // if (res2.data.avatar === '') {
      //   Axios.get('https://www.gravatar.com/avatar/00000000000000000000000000000000')
      // } else {
      //   const avatar = await getAvatarUrl(res2.data.avatar)
      // }
      res2.data.id = user.id
      commit('setUserProfile', res2.data)
      commit('setIsLoggingIn', true)
      return true
    },
    async logout({ commit }) {
      removeCookie('cryptomeetuptoken')
      commit('setIsLoggingIn', false)
      return true
    },
  },
});
