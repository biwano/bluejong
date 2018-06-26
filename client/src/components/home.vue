<template>
    <div class="uk-child-width-1-3@m uk-grid-small uk-grid-match" uk-grid>
      <div>
          <div class="uk-card uk-card-default uk-card-body">
              <h3 class="uk-card-title">{{ L.new_game }}</h3>
              <a v-on:click="newGame('mcr')">{{ L.MCR }}</a>
          </div>
          <div class="uk-card uk-card-default uk-card-body">
              <h3 class="uk-card-title">{{ L.new_tournament }}</h3>
              <a v-on:click="newTournament('mcr')">{{ L.MCR }}</a>
          </div>
      </div>
  </div>
</template>

<script>
import GameMixin from '@/mixins/gameMixin';
import TournamentMixin from '@/mixins/tournamentMixin';
import debounce from 'lodash.debounce';

export default {
  name: 'Home',
  mixins: [GameMixin, TournamentMixin],
  data() {
    return {
    };
  },
  created() {
    this.newGame = debounce(this.newGame, 500);
    this.newTournament = debounce(this.newTournament, 500);
  },
  methods: {
    newGame(gameType) {
      this.messagePromiseCatcher(this.gameService.create(gameType)).then((game) => {
        this.$router.push({ name: 'Game', params: { id: game._id } });
      });
    },
    newTournament(gameType) {
      this.messagePromiseCatcher(this.tournamentService.create(gameType)).then((tournament) => {
        this.$router.push({ name: 'Tournament',
          params: { id: tournament._id, tab: 'configuration' } });
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.uk-card {
  text-align: center;
}
</style>
