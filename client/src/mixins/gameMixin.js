import http from '@/framework/services/http';
import rulesSets from '@/business/rulesSets';

const GameService = {
  create(rules) {
    const status = 'ongoing';
    return http.put('game', { rules, status });
  },
  createForTournament(tournament, roundIndex, tableIndex) {
    const playerSlots = [];
    const round = tournament.rounds[roundIndex];
    const table = round.tables[tableIndex];
    for (let index = 0; index < tournament.rules.NB_PLAYERS; index += 1) {
      const player = tournament.playerSlots[table.playerSlotIndexes[index]].player;
      playerSlots.push({ index, player });
    }
    const status = 'ongoing';
    const tournamentId = tournament._id;
    const rules = tournament.rules.name;
    return http.put('game', { rules, status, tournamentId, tableIndex, roundIndex });
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
  gameModel: {
    playerSlots: [{ index: 0, player: undefined },
      { index: 1, player: undefined },
      { index: 2, player: undefined },
      { index: 3, player: undefined }],
    // Hands
    handSlots: [],
    penaltySlots: [],
    // Table point distribution
    rules: rulesSets.mcr,
    totals: [0, 0, 0, 0],
    tablePoints: [0, 0, 0, 0],
  },
};
const GameMixin = {
  created() {
    this.gameService = GameService;
  },
};

export { GameMixin, GameService };

export default GameMixin;
