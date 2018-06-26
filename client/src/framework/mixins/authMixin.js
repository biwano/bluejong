import http from '@/framework/services/http';


export default {
  computed: {
    userName() {
      return this.$store.getters['auth/name'];
    },
    userLogin() {
      return this.$store.getters['auth/login'];
    },
    userType() {
      return this.$store.getters['auth/type'];
    },
    loggedIn() {
      return this.$store.getters['auth/loggedIn'];
    },
  },
  methods: {
    authGetUserInfo() {
      return http.get('auth').then((user) => {
        this.$store.commit('auth/authenticate', user);
      });
    },
    authRequestRegistration(email) {
      return http.post('auth/request_registration', { email });
    },
    authUpdateProfile(params) {
      return http.post('auth', params);
    },
    authCheckToken(token) {
      return http.get(`auth/check_token/${encodeURI(token)}`);
    },
    authRegister(token, password) {
      return http.post('auth/register', { token, password });
    },
    authSignIn(email, password) {
      return http.post('auth/sign_in', { email, password });
    },
    authSignOut() {
      return http.post('auth/sign_out', { });
    },
    authAnonymizeProfile() {
      return http.post('auth/anonymize', { });
    },
    authIsEmailValid(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    authIsPasswordValid(password) {
      return password.length >= 8;
    },
  },
};
