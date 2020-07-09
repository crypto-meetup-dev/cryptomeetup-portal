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
import { uniqueId, startCase } from 'lodash';
import Axios from 'axios';
import { InterleavedBufferAttribute } from 'three';

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
    token: ''
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
    }
  },
  actions: {
    async login({ commit }, data) {
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
        // if (res2.data.avatar === '') {
        //   Axios.get('https://www.gravatar.com/avatar/00000000000000000000000000000000')
        // } else {
        //   const avatar = await getAvatarUrl(res2.data.avatar)
        // }
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
    },
    async setMapObject({ commit }, map) {
      commit('setMapObject', map)
    },
    async invite(context, data) {
      console.log('invite', context, data)
      const arr = []
      arr.push(data.email)
      Axios.get(process.env.VUE_APP_CMUAPI + '/invite?id=' + context.state.userId + '&email=' + data.email)
      Toast.open({
        message: data.invitationSentMsg,
        type: 'is-success',
        duration: 4000,
        queue: false,
      })
    }
  },
});
