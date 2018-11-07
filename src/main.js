import PreJS from 'prejs';
import * as CountryCode from 'i18n-iso-countries';
import L from 'leaflet';
import Vue from 'vue';
import Buefy from 'buefy';
import VueMoment from 'vue-moment';
import Transitions from 'vue2-transitions';
import router from '@/router';
import store from '@/store';
import i18n from '@/i18n';
import API from '@/util/api';
import PriceFormatter from '@/util/priceFormatter';
import App from '@/App.vue';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

CountryCode.registerLocale(require('i18n-iso-countries/langs/en.json'));
CountryCode.registerLocale(require('i18n-iso-countries/langs/zh.json'));
CountryCode.registerLocale(require('i18n-iso-countries/langs/ja.json'));

Vue.config.productionTip = false;
Vue.use(Buefy);
Vue.use(VueMoment);
Vue.use(Transitions);
Vue.use(PriceFormatter);
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
