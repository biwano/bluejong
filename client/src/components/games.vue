<template>
  <div>

    <table v-if="loaded" class="uk-table  uk-table-divider uk-table-hover uk-table-middle ">
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
            <a  class="uk-icon-flip uk-display-inline-block"
                uk-icon="icon: pencil"
                :href="`#/game/${game._id}`">
            </a>
            <a  class="uk-icon-flip uk-display-inline-block"
                uk-icon="icon: trash"
                @click="deleteGame(game._id)"
                >
            </a>

          </td>
        </tr>
      </tbody>
    </table>
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
      this.gameService.getAll().then((response) => {
        if (response.data.status === 'ko') {
          this.$store.commit('message/error', response.data.message);
        } else {
          this.games = response.data;
          this.loaded = true;
        }
      }).catch(() => this.messagesService.error('unexpected_error'));
    },
    deleteGame(gameId) {
      this.gameService.delete(gameId).then((response) => {
        if (response.data.status === 'ko') {
          this.$store.commit('message/error', response.data.message);
        } else {
          this.load();
        }
      }).catch(() => this.messagesService.error('unexpected_error'));
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
