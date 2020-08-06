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
    async login({ commit }, data) {
      if (data.email === '' || data.email === undefined || data.email === null) {
        Toast.open({
          message: '邮箱不可以为空',
          type: 'is-danger',
          duration: 4000,
          queue: false,
        })
        return
      } else if (data.password === '' || data.password === undefined || data.password === null) {
        Toast.open({
          message: '密码不可以为空',
          type: 'is-danger',
          duration: 4000,
          queue: false,
        })
        return
      }
      const res = await loginWithEmail(data.email, data.password)
      if (res.message === '密码错误') {
        Toast.open({
          message: data.loginFailedMsg,
          type: 'is-danger',
          duration: 4000,
          queue: false,
        })
      } else {
        Toast.open({
          message: data.loginSuccessMsg,
          type: 'is-success',
          duration: 4000,
          queue: false,
        })

        const accessToken = res.data
        setCookie('cryptomeetuptoken', accessToken)
        const user = disassemble(accessToken);
        commit('setToken', accessToken)
        /**
         * user.iss: "username"
         * user.exp: 1594276659373
         * user.platform "email"
         * user.id 0
         */
        const res2 = await getUserProfile(user.id)
        Axios.get(process.env.VUE_APP_CMUAPI + '/user/login?id=' + user.id + '&email=' + data.email + '&nickname=' + res2.data.nickname + '&avatar=' + res2.data.avatar)
        res2.data.id = user.id
        
        commit('setUserProfile', res2.data)
        commit('setIsLoggingIn', true)
        commit('setUserId', user.id)
        return true
      }
    },
    async logout({ commit }) {
      removeCookie('cryptomeetuptoken')
      clearAllCookie()
      commit('setIsLoggingIn', false)
      return true
    },
    async setLoggedIn({ commit }, res) {
      const res2 = await getUserProfile(res.id)
      commit('setUserId', res.id)
      commit('setIsLoggingIn', true)
      commit('setUserProfile', res2.data)
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
