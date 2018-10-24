import Vue from 'vue';
import Buefy from 'buefy';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import i18n from './i18n';

import PreJS from 'prejs';

import * as CountryCode from 'i18n-iso-countries';

CountryCode.registerLocale(require('i18n-iso-countries/langs/en.json'));

Vue.use(Buefy);
Vue.config.productionTip = false;

const pre = new PreJS();
pre.on('progress', (progress) => {
  document.querySelector('#progress').style.width = `${progress * 100}%`;
});
pre.on('complete', () => {
  // When all assets are preloaded, we create Vue DOM.
  new Vue({
    router,
    store,
    i18n,
    render: h => h(App),
  }).$mount('#app');
  setTimeout(() => document.querySelector('#load').remove(), 100);
});
pre.load([
  '/earth.jpg',
  '/starfield.png',
  '/weather.jpg',
]);
