import Vue from 'vue';
import Vuex from 'vuex';
import { Toast } from 'buefy/dist/components/toast';
import ui from './ui';
import modules from '@/config/modules.js';
import { loginWithEmail, getUserProfile } from '../api/login'
import { getCookie, setCookie, disassemble, removeCookie, clearAllCookie } from '../util/cookies'
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
    mapObject: {},
    userProfile: {
      id: 0
    },
    friends: '',
    notification: '',
    userId: 0,
    token: '',
    wallet: ''
  },
  getters: {
    getUserProfile(state) {
      return state.userProfile
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
    setMyBalance(state, { symbol, balance }) {
      state.balances[symbol] = balance;
    },
    setDividendInfo(state, dividendInfo) {
      state.dividendInfo = dividendInfo;
    },
    setMyCheckInStatus(state, status) {
      state.myCheckInStatus = status;
    },
    setUserProfile(state, userProfile) {
      state.userProfile = userProfile
    },
    setMapObject(state, mapObject) {
      state.mapObject = mapObject
    },
    setFriends(state, friends) {
      state.friends = friends
    },
    setUserId(state, userId) {
      state.userId = userId
    },
    setToken(state, token) {
      state.token = token
    },
    setWallet(state, wallet) {
      state.wallet = wallet
    }
  },
  actions: {
    async setToken({ commit }, data) {
      const accessToken = data
      setCookie('cryptomeetuptoken', accessToken)
      commit('setToken', accessToken)
    },
    async logout({ commit }) {
      removeCookie('cryptomeetuptoken')
      clearAllCookie()
      commit('setIsLoggingIn', false)
      return true
    },
    async setLoggedIn({ commit }, res) {
      console.log(res)
      const res2 = await getUserProfile(res.id)
      commit('setUserId', res.id)
      commit('setIsLoggingIn', true)
      commit('setUserProfile', res2.data.data)
      console.log(res2.data)
      Axios.get(process.env.VUE_APP_CMUAPI + '/user/login?id=' + res.id + '&email=undefined&nickname=' + res2.data.data.nickname + '&avatar=' + res2.data.data.avatar).then(r => {
        console.log(r)
      })
      Axios({
        url: process.env.VUE_APP_MATATAKIAPI + '/token/tokenlist?pagesize=999&order=0&page=1',
        method: 'GET',
        headers: { 'x-access-token': getCookie('cryptomeetuptoken') }
      }).then(res3 => {
        commit('setWallet', res3.data.data.list)
      })
    },
    async setMapObject({ commit }, map) {
      commit('setMapObject', map)
    },
    async setWallet({ commit }, data) {
      commit('setWallet', data)
    },
    async invite(context, data) {
      const arr = []
      arr.push(data.email)
      const res = await Axios.get(process.env.VUE_APP_CMUAPI + '/invite?id=' + context.state.userId + '&email=' + data.email)
      if (res.data.status === 'failed') {
        Toast.open({
          message: data.invitationSentFailedMsg,
          type: 'is-danger',
          duration: 4000,
          queue: false,
        })
      }
      Toast.open({
        message: data.invitationSentMsg,
        type: 'is-success',
        duration: 4000,
        queue: false,
      })
    },
    async acceptInvite(context, data) {
      Axios.get(process.env.VUE_APP_CMUAPI + '/invite/update?id=' + context.state.userId + '&result=accept&notifyId=' + data.notifyId + '&inviteUser=' + data.userId)
    },
    async denyInvite(context, data) {
      Axios.get(process.env.VUE_APP_CMUAPI + '/invite/update?id=' + context.state.userId + '&result=deny&notifyId=' + data.notifyId + '&inviteUser=' + data.userId)
    }
  },
});
