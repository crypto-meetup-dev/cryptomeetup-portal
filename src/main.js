import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs2';

import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

import * as config from '@/config';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

ScatterJS.plugins(new ScatterEOS());

ScatterJS.scatter.connect(config.appScatterName, { initTimeout: 5000 }).then((connected) => {
  if (!connected) {
    console.log('Scatter is not installed');
    return;
  }
  console.log('Scatter is connected');
});

setTimeout(() => document.querySelector('#load').remove(), 1000);
