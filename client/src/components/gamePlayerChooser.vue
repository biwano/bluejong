<template>

  <div>
    <!-- edit mode -->
    <span :hidden="mode!=='edit'">
          <player-suggestion v-model="player"
            v-on:input="playerUpdated($event)"
            v-on:update:query="queryUpdated($event)"
            v-on:blur="mode='read'"
            :suggestionFilter="suggestionFilter"
            ref="suggestion" class="uk-display-inline-block">
          </player-suggestion>


    </span>
    <!-- Read Mode -->
    <div :hidden="mode!=='read'" class="uk-text-nowrap">
          <span v-if="player!==undefined" class="uk-display-inline-block"> {{ player.name }}</span>
            <a  class="uk-icon-flip uk-display-inline-block"
                uk-icon="icon: pencil"
                v-on:click="editMode()">
            </a>

    </div>
  </div>
</template>

<script>
import PlayerMixin from '@/mixins/playerMixin';
import PlayerSuggestion from './playerSuggestion';

export default {
  name: 'gamePlayerChooser',
  props: ['value', 'suggestionFilter'],
  mixins: [PlayerMixin],
  data() {
    return { query: '',
      player: undefined,
      mode: undefined,
    };
  },
  watch: {
    value(newVal) {
      this.player = newVal;
    },
  },
  created() {
    this.player = this.value;
    this.mode = 'read';
  },
  methods: {
    playerUpdated(player) {
      this.player = player;
      this.$emit('input', this.player);
      if (this.player !== undefined) this.mode = 'read';
    },
    editMode() {
      this.mode = 'edit';
      this.$refs.suggestion.focus();
    },
    queryUpdated(query) {
      this.query = query;
    },
  },
  components: { 'player-suggestion': PlayerSuggestion },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
