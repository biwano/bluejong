import http from '@/framework/services/http';

const playerService = {
  create(name) {
    return http.post('player', { name });
  },
  find(query) {
    return http.get(`player/search/${query}`);
  },
  get(id) {
    return http.get(`player/${id}`);
  },
};

export default {
  created() {
    this.playerService = playerService;
  },
};
