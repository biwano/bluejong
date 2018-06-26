import http from '@/framework/services/http';
import roundModels from '@/business/roundModels';
import rulesSets from '@/business/rulesSets';

const tournamentService = {
  create(rules) {
    return http.put('tournament', { rules, status: 'creating' });
  },
  get(id) {
    return new Promise((resolve, reject) => {
      http.get(`tournament/${id}`).then((response) => {
        // Unpacking tournament
        const tournament = response;
        // Unpacking roundmodel
        tournament.roundModel = roundModels[tournament.roundModel];
        // Unpacking Rules
        tournament.rules = rulesSets[tournament.rules];
        resolve(tournament);
      }).catch(e => reject(e));
    });
  },

  save(id, tournament_) {
    const tournament = Object.assign({}, tournament_);
    // packing roundModel
    tournament.roundModel = tournament.roundModel.name;
    // packing rulesSet
    tournament.rules = tournament.rules.name;
    // Packing tournament
    tournament.roundModel = tournament.roundModel.name;
    return http.post(`tournament/${id}`, tournament);
  },
  /*
  delete(id) {
    return http.delete(`game/${id}`);
  },
  getAll() {
    return http.get('game');
  },
  */
};

export default {
  created() {
    this.tournamentService = tournamentService;
  },
};
