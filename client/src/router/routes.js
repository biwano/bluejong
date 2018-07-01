import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/home';
import Games from '@/components/game/games';
import Game from '@/components/game/game';
import Tournament from '@/components/tournament/tournament';
import Register from '@/components/auth/register';
import RegistrationRequest from '@/components/auth/registrationRequest';
import SignIn from '@/components/auth/signIn';
import Profile from '@/components/auth/profile';

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
    { path: '/tournament/:id', name: 'Tournament', component: Tournament },
    { path: '/tournament/:id/:tab', name: 'TournamentTab', component: Tournament },
    { path: '/profile', name: 'Profile', component: Profile },
  ],
});
