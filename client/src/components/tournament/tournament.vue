<template>
  <div>
    <tabs :tabs='tabs' :value="tab" @input="switchTab($event)"></tabs>
    <div v-if="tournament">
      <tournament-config :hidden="tab!=='configuration'"
          :tournament="tournament"
          @saved="switchTab('preparation')"></tournament-config>
      <tournament-preparation :hidden="tab!=='preparation'"
        :tournament="tournament"
        @saved="switchTab('management')"></tournament-preparation>
      <tournament-management :hidden="tab!=='management'"
        :tournament="tournament"
        @saved="switchTab('management')"></tournament-management>
      </div>
    </div>
</template>

<script>
import rulesSets from '@/business/rulesSets';
import GameMixin from '@/mixins/gameMixin';
import Tabs from '@/framework/components/tabs';
import { TournamentMixin, TournamentService } from '@/mixins/tournamentMixin';
import TournamentConfig from './tournamentConfig';
import TournamentPreparation from './tournamentPreparation';
import TournamentManagement from './tournamentManagement';
import PlayerChooser from '../player/playerChooser';

export default {
  name: 'Tournament',
  mixins: [GameMixin, TournamentMixin],
  data() {
    return {
      tab: '',
      tournament: {
        nbRounds: 0,
        nbTables: 0,
        teamsSize: 0,
        teamTournament: false,
        roundModel: 0,
        playerSlots: [],
        roundSlots: [],
        rules: rulesSets.mcr,
        loaded: false,
      },
    };
  },
  beforeRouteUpdate(to, from, next) {
    if (this !== undefined) {
      if (to.params.id !== from.params.id) {
        this.load();
      }
      this.tab = to.params.tab;
    }
    next();
  },
  beforeRouteEnter(to, from, next) {
    const id = to.params.id;
    // Redirect if called without tab parameter
    if (to.params.tab === undefined) {
      TournamentService.get(id).then((tournament) => {
        const route = { name: 'TournamentTab',
          params: { id, tab: TournamentService.tournamentTab(tournament) } };
        next(route);
      }).catch((e) => { console.error(e); });
    } else next();
  },
  mounted() {
    this.load();
    this.tab = this.$route.params.tab;
  },
  methods: {
    switchTab(tab) {
      const route = { name: 'TournamentTab', params: { id: this.tournament._id, tab } };
      this.$router.push(route);
    },
    // switch to the first tab authorizeb by the tournament status
    autoTab() {
      const tab = this.tournamentService
        .getStatus(this.tournament.status)
        .tabs[0];
      this.switchTab(tab);
    },
    // Loads the game
    load() {
      const id = this.$route.params.id;
      const __this = this;
      this.messagePromiseCatcher(this.tournamentService.get(id).then((tournament) => {
        this.tournament = tournament;
        if (__this.tab === undefined || __this.tab.length === 0) __this.autoTab();
      }));
    },
    // A player was updated
    playerUpdated(playerSlot) {
      this.focusPlayer(playerSlot.index);
      this.save();
    },
    // Change focus when a player is updated
    focusPlayer(index) {
      // To the next undefined player
      for (let i = 0; i < this.playerSlots.length; i += 1) {
        if (i !== index) {
          const playerSlot = this.playerSlots[i];
          if (playerSlot.player === undefined) {
            this.$refs[`chooser${playerSlot.index}`][0].editMode();
            return;
          }
        }
      }
    },
  },
  computed: {
    tabs() {
      return this.tournamentService.tabs(this.tournament.status);
    },
  },
  components: {
    'player-chooser': PlayerChooser,
    'tournament-config': TournamentConfig,
    'tournament-preparation': TournamentPreparation,
    'tournament-management': TournamentManagement,
    tabs: Tabs,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
