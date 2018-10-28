import PreJS from 'prejs';
import * as CountryCode from 'i18n-iso-countries';
import Vue from 'vue';
import Buefy from 'buefy';
import VueMoment from 'vue-moment';
import router from '@/router';
import store from '@/store';
import i18n from '@/i18n';
import API from '@/util/api';
import EosPriceFormatter from '@/util/eosPriceFormatter';
import App from '@/App.vue';

CountryCode.registerLocale(require('i18n-iso-countries/langs/en.json'));
CountryCode.registerLocale(require('i18n-iso-countries/langs/zh.json'));
CountryCode.registerLocale(require('i18n-iso-countries/langs/ja.json'));

Vue.config.productionTip = false;
Vue.use(Buefy);
Vue.use(VueMoment);
Vue.use(EosPriceFormatter);
Vue.use(API);

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
