import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/home';
import Games from '@/components/games';
import Game from '@/components/game';
import Register from '@/components/register';
import RegistrationRequest from '@/components/registrationRequest';
import SignIn from '@/components/signIn';

Vue.use(Router);

export default new Router({
  routes: [
    { path: '/', name: 'Base', component: Home },
    { path: '/home', name: 'Home', component: Home },
    { path: '/registration_request', name: 'RegistrationRequest', component: RegistrationRequest },
    { path: '/register/:token', name: 'Register', component: Register },
    { path: '/sign_in', name: 'SignIn', component: SignIn },
    { path: '/games', name: 'Games', component: Games },
    { path: '/game/:id', name: 'Game', component: Game },
  ],
});
