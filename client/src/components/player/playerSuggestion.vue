<template>
  <span class="uk-text-nowrap">
    <suggestion v-model="player" v-on:input="playerUpdated($event)"
      :suggestions="suggestions" v-on:update:query="queryUpdated($event)"
      :placeholder="placeholder"
      :suggestionFilter="suggestionFilter"
      v-on:blur="$emit('blur')"
      v-on:create="createPlayer($event)"
      ref="suggestion"
      class="uk-display-inline-block"
    ></suggestion>

  </span>
</template>

<script>
import PlayerMixin from '@/mixins/playerMixin';

export default {
  name: 'PlayerSuggestion',
  props: ['value', 'suggestionFilter', 'placeholder'],
  mixins: [PlayerMixin],
  data() {
    return { suggestions: [],
      player: undefined,
      query: '',
    };
  },
  created() {
    this.player = this.value;
  },
  methods: {
    queryUpdated(query) {
      this.query = query;
      this.$emit('update:query', query);
      this.messagePromiseCatcher(this.playerService.find(query).then((players) => {
        this.suggestions = [];
        for (let i = 0; i < players.length; i += 1) {
          const player = players[i];
          const suggestion = { id: player._id,
            display: player.name,
            value: player,
          };
          if (this.suggestionFilter(suggestion)) {
            this.suggestions.push(suggestion);
          }
        }
      }));
    },
    playerUpdated(player) {
      this.$emit('input', player);
    },
    focus() {
      this.$refs.suggestion.focus();
      this.queryUpdated(this.query);
    },
    createPlayer(name) {
      this.playerService.create(name).then((data) => {
        this.playerUpdated(data);
        this.$emit('blur');
      }).catch((data) => {
        if (data.message === 'player_exists') {
          this.playerUpdated(data.payload);
        } else {
          this.displayError(data.message);
        }
      });
    },

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
