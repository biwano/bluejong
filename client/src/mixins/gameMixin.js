import http from '@/framework/services/http';

const gameService = {
  create(rules) {
    return http.put('game', { rules, status: 'ongoing' });
  },
  get(id) {
    return http.get(`game/${id}`);
  },
  save(id, game) {
    return http.post(`game/${id}`, game);
  },
};

export default {
  created() {
    this.gameService = gameService;
  },
};
