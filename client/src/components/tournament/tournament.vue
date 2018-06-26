<template>
  <div>
    <tabs :tabs='tabs' :value="tab" @input="switchTab($event)"></tabs>
    <tournament-config :hidden="tab!=='configuration'"
      :tournament="tournament"
      @save="save('preparation')"></tournament-config>
  </div>
</template>

<script>
import rulesSets from '@/business/rulesSets';
import GameMixin from '@/mixins/gameMixin';
import Tabs from '@/framework/components/tabs';
import TournamentMixin from '@/mixins/tournamentMixin';
import TournamentConfig from './tournamentConfig';
import PlayerChooser from '../player/playerChooser';

export default {
  name: 'Tournament',
  mixins: [GameMixin, TournamentMixin],
  data() {
    return {
      tab: '',
      tabs: [{ id: 'configuration', description: 'tournament_configuration' },
        { id: 'preparation', description: 'tournament_preparation' },
      ],
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
    if (to.params.id !== from.params.id) {
      this.load();
    }
    this.tab = to.params.tab;
    next();
  },
  created() {
    this.load();
    this.tab = this.$route.params.tab;
  },
  methods: {
    switchTab(tab) {
      this.$router.push({ name: 'Tournament', params: { id: this.tournament._id, tab } });
    },
    // Loads the game
    load() {
      this.tournament_id = this.$route.params.id;
      this.messagePromiseCatcher(
        this.tournamentService.get(this.tournament_id).then((tournament) => {
          this.tournament = tournament;
        }));
    },
    // Saves the game
    save(nextTab) {
      this.$nextTick(() => {
        this.messagePromiseCatcher(
          this.tournamentService.save(this.tournament_id, this.tournament).then(() => {
            this.switchTab(nextTab);
          }));
      });
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
    // Players' totals
    /*
    totals() {
      return this.rules.totals(this.playerSlots, this.handSlots, this.penaltySlots);
    },
    // Players' table points
    tablePoints() {
      return this.rules.tablePoints(this.playerSlots, this.handSlots, this.penaltySlots);
    },
    // game ready if all players are filled
    ready() {
      let ready = true;
      for (let i = 0; i < this.playerSlots.length; i += 1) {
        if (this.playerSlots[i].player === undefined) ready = false;
      }
      return ready;
    },
    // game is finished?
    status() {
      return this.rules.isFinished(this.handSlots) ? 'ongoing' : 'finished';
    } */
  },
  components: {
    'player-chooser': PlayerChooser,
    'tournament-config': TournamentConfig,
    tabs: Tabs,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
