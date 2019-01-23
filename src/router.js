import Vue from 'vue';
import Router from 'vue-router';
import PreJS from 'prejs';
import store from '@/store';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'globe',
      component: () => import('@/views/GlobeView.vue'),
      beforeEnter: (to, from, next) => {
        store.commit('ui/setGlobalProgressVisible', true);
        store.commit('ui/setGlobalProgressValue', 0);
        const pre = new PreJS();
        pre.on('progress', (progress) => {
          store.commit('ui/setGlobalProgressValue', progress);
        });
        pre.on('complete', () => {
          store.commit('ui/setGlobalProgressVisible', false);
          next();
        });
        pre.load([
          '/earth.jpg',
          '/starfield.png',
          '/weather.jpg',
        ]);
      },
    },
    {
      path: '/map',
      name: 'home',
      component: () => import('@/views/MapView.vue'),
    }
  ],
});

router.beforeEach((to, from, next) => {
  store.commit('ui/setGlobalSpinnerVisible', true);
  next();
});
router.afterEach(() => {
  store.commit('ui/setGlobalSpinnerVisible', false);
});

export default router;
