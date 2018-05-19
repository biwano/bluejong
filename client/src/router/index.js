import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/home';
import Games from '@/components/games';
import Game from '@/components/game';

Vue.use(Router);

export default new Router({
  routes: [
    { path: '/', name: 'Base', component: Home },
    { path: '/home', name: 'Home', component: Home },
    { path: '/games', name: 'Games', component: Games },
    { path: '/game/:id', name: 'Game', component: Game },
  ],
});
