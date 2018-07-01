import http from '@/framework/services/http';
import roundModels from '@/business/roundModels';
import rulesSets from '@/business/rulesSets';

const TournamentService = {
  statuses: [
    { id: 'configuration',
      description: 'tournament_configuration',
      tabs: ['configuration'],
    },
    { id: 'preparation',
      description: 'tournament_preparation',
      tabs: ['configuration', 'preparation'],
    },
    { id: 'management',
      description: 'tournament_management',
      tabs: ['preparation', 'management'],
    },
  ],
  create(rules) {
    return http.put('tournament', { rules, status: 'configuration' });
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
    // Preparing save
    const tournament = Object.assign({}, tournament_);
    // packing roundModel
    tournament.roundModel = tournament.roundModel.name;
    // packing rulesSet
    tournament.rules = tournament.rules.name;
    // Packing tournament
    tournament.roundModel = tournament.roundModel.name;

    // saving
    return http.updateHandler(http.post(`tournament/${id}`, tournament), tournament_);
  },
  /*
  delete(id) {
    return http.delete(`game/${id}`);
  },
  getAll() {
    return http.get('game');
  },
  */
  adjustPlayers(tournament_) {
    // Ajusting number of players
    const tournament = tournament_;
    const nbPlayers = tournament.nbTables * tournament.rules.NB_PLAYERS;

    if (tournament.playerSlots.length > nbPlayers) {
      tournament.playerSlots.splice(nbPlayers);
    }
    while (tournament.playerSlots.length < nbPlayers) {
      tournament.playerSlots.push({ index: tournament.playerSlots.length,
        player: undefined });
    }
  },
  // Retourne une configuration d'onglet adéquate pour tab
  tabs(tab) {
    const activeStatus = this.getStatus(tab);
    const tabs = [];
    for (let i = 0; i < this.statuses.length; i += 1) {
      const status = this.statuses[i];
      const id = status.id;
      const description = status.description;
      const disabled = activeStatus.tabs.indexOf(id) < 0;
      if (!disabled) tabs.push({ id, description, disabled });
    }
    return tabs;
  },
  tournamentTab(tournament) {
    return this.getStatus(tournament.status).tabs[0];
  },
  // return a status from the id
  getStatus(id) {
    const statuses = this.statuses.filter(status => status.id === id);
    if (statuses.length > 0) return statuses[0];
    return this.getStatus('configuration');
  },
};
const TournamentMixin = {
  created() {
    this.tournamentService = TournamentService;
  },
};
export { TournamentMixin, TournamentService };
export default TournamentMixin;
