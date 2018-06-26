import http from '@/framework/services/http';
import rulesSets from '@/business/rulesSets';

const gameService = {
  create(rules) {
    return http.put('game', { rules, status: 'ongoing' });
  },
  get(id) {
    return new Promise((resolve, reject) => http.get(`game/${id}`).then((game_) => {
      const game = game_;
      // Unpacking Rules
      game.rules = rulesSets[game.rules];
      // Unpacking Players
      for (let i = 0; i < 4; i += 1) {
        if (game.playerSlots.length <= i) {
          game.playerSlots.push({ index: i, player: undefined });
        }
      }

      resolve(game);
    }).catch(data => reject(data)));
  },
  delete(id) {
    return http.delete(`game/${id}`);
  },
  save(id, game_) {
    const game = Object.assign({}, game_);
    game.rules = game.rules.name;
    return http.updateHandler(http.post(`game/${id}`, game), game_);
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
