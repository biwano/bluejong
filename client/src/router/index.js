import Vue from 'vue';
import Router from 'vue-router';
import Game from '@/components/game';
import Home from '@/components/home';

Vue.use(Router);

export default new Router({
  routes: [
    { path: '/game/:id', name: 'Game', component: Game },
    { path: '/home', name: 'Home', component: Home },
  ],
});
