<template>
  <div>

    <table v-if="games.length>0" class="uk-table  uk-table-divider uk-table-hover uk-table-middle ">
      <!-- Header -->
      <thead>
       <tr>
          <th>{{ L.date }}</th>
          <th>{{ L.players }}</th>
          <th>{{ L.actions }}</th>
        </tr>
      </thead>
      <!-- games list -->
      <tbody>
        <tr v-for="game in games" :key="game._id">
          <td>{{ game.created | formatDate}}</td>
          <td>
            <span v-for="playerSlot in game.playerSlots" :key="playerSlot.index"
              v-if="playerSlot.player !== undefined">
              {{ playerSlot.player.name }}
              <span class="uk-badge uk-text-small uk-background-secondary uk-text-muted">
                {{ game.totals[playerSlot.index] }}
              </span>
              <br/>
            </span>
          </td>
          <td>
            <icon icon="pencil" :url="`#/game/${game._id}`"></icon>
            <icon icon="trash" @click="deleteGame(game._id)" :confirm-click="true"></icon>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="loaded && games.length===0" class="uk-alert-primary uk-text-center" uk-alert>
      <h3>{{ L.no_games }}</h3>
    </div>
  </div>
</template>

<script>
import GameMixin from '@/mixins/gameMixin';

export default {
  name: 'Games',
  mixins: [GameMixin],
  data() {
    return {
      // Players
      games: [],
      loaded: false,
    };
  },
  created() {
    this.load();
  },

  methods: {
    // Loads the game
    load() {
      this.game_id = this.$route.params.id;
      this.messagePromiseCatcher(this.gameService.getAll().then((games) => {
        this.games = games;
        this.loaded = true;
      }));
    },
    deleteGame(gameId) {
      this.messagePromiseCatcher(this.gameService.delete(gameId).then(() => {
        this.load();
      }));
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
