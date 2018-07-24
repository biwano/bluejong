<template>
  <div>
    <div>
      <div v-if="!ready" class="uk-margin-left uk-margin-right">
        <div class="uk-margin">
           <span class="uk-card-title">{{ L.players }}</span><br/>
        </div>
        <div class="uk-child-width-1-4@s" uk-grid>
          <div v-for="playerSlot in game.playerSlots"
            :key="playerSlot.index">
            <player-chooser
              v-model="playerSlot.player"
              @input="playerUpdated(playerSlot)"
              :suggestionFilter="playerSuggestionFilter"
              :placeholder="L.choose"
              :ref="`chooser${playerSlot.index}`">
            </player-chooser>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="uk-margin-left uk-margin-right">
          <icon
            icon="ban"
            @click="reset()"
            :confirm-click="true">
          </icon>
        </div>
        <hr/>
        <game-editor
          v-model="game"
          playerSlots="playerSlots"
          @input="save()">
        </game-editor>
      </div>
    </div>
  </div>
</template>

<script>
import { GameMixin, GameService } from '@/mixins/gameMixin';
import PlayerMixin from '@/mixins/playerMixin';
import PlayerChooser from '../player/playerChooser';
import GameEditor from './gameEditor';

export default {
  name: 'Game',
  mixins: [GameMixin, PlayerMixin],
  data() {
    return {
      // Game
      game: GameService.gameModel,
      loaded: false,
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
      this.game_id = this.$route.params.id;
      this.messagePromiseCatcher(this.gameService.get(this.game_id).then((game) => {
        this.game = game;
        this.loaded = true;
      }));
    },
    // Saves the game
    save() {
      this.$nextTick(() => {
        this.game.rules.updateGame(this.game);
        this.messagePromiseCatcher(this.gameService.save(this.game_id, this.game));
      });
    },
    playerUpdated() {
      this.playerService.focusPlayerSlot(this.game.playerSlots, this.$refs, 'chooser');
      this.save();
    },
    // Filters players already selected
    playerSuggestionFilter(playerSuggestion) {
      return this.playerService.filterPlayer(playerSuggestion, this.game.playerSlots);
    },
    // Reset all players
    reset() {
      for (let i = 0; i < this.game.playerSlots.length; i += 1) {
        this.game.playerSlots[i].player = undefined;
      }
    },
  },
  computed: {
    // Game ready if all players are filled
    ready() {
      let ready = true;
      for (let i = 0; i < this.game.playerSlots.length; i += 1) {
        if (this.game.playerSlots[i].player === undefined) ready = false;
      }
      return ready;
    },
  },
  components: {
    'player-chooser': PlayerChooser,
    'game-editor': GameEditor,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
