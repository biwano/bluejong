import http from '@/framework/services/http';
import roundModels from '@/business/roundModels';

const tournamentService = {
  create(rules) {
    return http.put('tournament', { rules, status: 'creating' });
  },
  get(id) {
    const promise = http.get(`tournament/${id}`);
    promise.then((response) => {
      const tournament = response.data;
      // Unpacking tournament
      tournament.roundModel = roundModels[tournament.roundModel];
    });

    return promise;
  },

  save(id, tournament_) {
    const tournament = Object.assign({}, tournament_);
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
