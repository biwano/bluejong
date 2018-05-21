import http from '@/framework/services/http';

const authService = {
  getUserInfo() {
    return http.get('auth');
  },
};

export default {
  created() {
    this.authService = authService;
  },
};
