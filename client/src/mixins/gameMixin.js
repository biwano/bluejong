import http from '@/framework/services/http';

const gameService = {
  create(rules) {
    return http.put('game', { rules, status: 'ongoing' });
  },
  get(id) {
    return http.get(`game/${id}`);
  },
  delete(id) {
    return http.delete(`game/${id}`);
  },
  save(id, game) {
    return http.post(`game/${id}`, game);
  },
  getAll() {
    return http.get('game');
  },
};

export default {
  created() {
    this.gameService = gameService;
  },
};
