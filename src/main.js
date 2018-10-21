import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

import PreJS from 'prejs';

const pre = new PreJS();
pre.on('progress', (progress) => {
  document.querySelector('#progress').style.width = `${progress * 100}%`;
});
pre.on('complete', () => {
  // When all assets are preloaded, we create Vue DOM.
  Vue.config.productionTip = false;
  new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app');
  setTimeout(() => document.querySelector('#load').remove(), 100);
});
pre.load([
  '/earth.jpg',
  '/starfield.png',
  '/weather.jpg',
]);
