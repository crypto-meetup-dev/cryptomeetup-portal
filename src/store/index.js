import Vue from 'vue';
import Vuex from 'vuex';
import { Toast } from 'buefy/dist/components/toast';
import Geo from '@/util/geo';
import API from '@/util/api';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isScatterConnected: false,
    scatterAccount: null,
    isScatterLoggingIn: false,
    isLoadingData: false,
    landInfo: {},
    landInfoUpdateAt: null,
  },
  mutations: {
    setLandInfo(state, landInfo) {
      state.landInfo = landInfo;
      state.landInfoUpdateAt = new Date();
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
    async loginScatterAsync({ commit }) {
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
