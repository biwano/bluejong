<template>
    <div class="uk-child-width-1-3@m uk-grid-small uk-grid-match" uk-grid>
    <div>
        <div class="uk-card uk-card-default uk-card-body">
            <h3 class="uk-card-title">{{ L.new_game }}</h3>
            <a v-on:click="newGame('mcr')">{{ L.MCR }}</a>
        </div>
    </div>
</div>
</template>

<script>
import GameMixin from '@/mixins/gameMixin';
import debounce from 'lodash.debounce';

export default {
  name: 'Home',
  mixins: [GameMixin],
  data() {
    return {
      loading: false,
    };
  },
  created() {
    this.newGame = debounce(this.newGame, 500);
  },
  methods: {
    newGame(gameType) {
      this.gameService.create(gameType).then((response) => {
        this.$router.push({ name: 'Game', params: { id: response.data._id } });
        this.loading = false;
      }).catch(() => { this.loading = false; });
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
