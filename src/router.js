import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import User from './views/User.vue';
import Token from './views/Token.vue';
import Vote from './views/Vote.vue';
import About from './views/About.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/user',
      name: 'user',
      component: User,
    },     
    {
      path: '/token',
      name: 'token',
      component: Token,
    },      
    {
      path: '/vote',
      name: 'vote',
      component: Vote,
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },              
  ],
});
