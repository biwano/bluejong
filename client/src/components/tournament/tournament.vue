<template>
  <div>
    <ul uk-tab>
      <li class="uk-active"><a href="#">Left</a></li>
      <li><a>{{ L.tournament_configuration }}</a></li>
      <li><a>{{ L.tournament_preparation }}</a></li>
      <li class="uk-disabled"><a>Disabled</a></li>
    </ul>
    <tournament-config :tournament="tournament"></tournament-config>
  </div>
</template>

<script>
import rulesSets from '@/business/rulesSets';
import GameMixin from '@/mixins/gameMixin';
import TournamentMixin from '@/mixins/tournamentMixin';
import TournamentConfig from './tournamentConfig';
import PlayerChooser from '../player/playerChooser';

export default {
  name: 'Tournament',
  mixins: [GameMixin, TournamentMixin],
  data() {
    return {
      tournament: {
        nbPlayers: 0,
        nbRounds: 0,
        teamsSize: 0,
        teamTournament: false,
        RoundModel: 0,
        playerSlots: [],
        roundSlots: [],
        rules: rulesSets.mcr,
        loaded: false,
      },
    };
  },
  beforeRouteUpdate(to, from, next) {
    this.load();
    next();
  },
  created() {
    this.load();
  },

  methods: {
    // Loads the game
    load() {
      this.tournament_id = this.$route.params.id;
      this.tournamentService.get(this.tournament_id).then((response) => {
        if (response.data.status === 'ko') {
          this.displayError(response.data.message);
        } else {
          this.tournament = response.data;
          // Unpacking Rules

          // Unpacking players
          /*
          for (let i = 0; i < this.tournament.playerSlots.length; i += 1) {
            const playerSlot = this.playerSlots[i];
            if (tournament.playerSlots !== undefined
              && i < tournament.playerSlots.length
              && tournament.playerSlots[i].player != null) {
              playerSlot.player = tournament.playerSlots[i].player;
            } else {
              playerSlot.player = undefined;
            }
          }
          // Unpacking Hands
          this.roundSlots = tournament.roundSlots;
          this.loaded = true;
          */
        }
      }).catch(() => this.displayError('error_unexpected'));
    },
    // Saves the game
    save() {
      this.$nextTick(() => {
        this.tournamenentService.save(this.tournament_id, {
          roundSlots: this.handSlots,
          playerSlots: this.playerSlots,
          totals: this.totals,
          tablePoints: this.tablePoints,
          status: this.status,
        });
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
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
