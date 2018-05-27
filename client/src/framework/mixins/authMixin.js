import http from '@/framework/services/http';


export default {
  computed: {
    userName() {
      return this.$store.getters['auth/name'];
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
      const request = http.get('auth');
      request.then((response) => {
        if (response.status !== 'ko') {
          this.$store.commit('auth/authenticate', response.data);
        }
      }).catch(() => {
        this.displayError('error_unexpected');
      });
      return request;
    },
    authRequestRegistration(email) {
      return http.post('auth/request_registration', { email });
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
    authIsEmailValid(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    authIsPasswordValid(password) {
      return password.length >= 8;
    },
  },
};
