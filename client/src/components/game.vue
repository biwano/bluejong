<template>
  <div>

    <table v-if="loaded" class="uk-table">
      <!-- Header -->
      <thead>
        <tr>
          <th colspan="4" v-if="ready"></th>
          <th></th>
        </tr>
        <tr>
          <th class="uk-text-center">{{ L.wind }}</th>
          <th class="uk-text-center">{{ L.winner }}</th>
          <th class="uk-text-center">{{ L.picked_on }}</th>
          <th class="uk-text-center">{{ L.points }}</th>
          <th v-for="playerSlot in playerSlots" :key="playerSlot.index">
            <game-player-chooser
              v-model="playerSlot.player"
              @input="playerUpdated(playerSlot)"
              :suggestionFilter="playerSuggestionFilter"
              :ref="`chooser${playerSlot.index}`">
            </game-player-chooser>
          </th>
        </tr>
      </thead>
      <!-- Rounds -->
      <game-round v-for="roundSlot in roundSlots" :key="roundSlot.index"
        :visible="ready"
        :playerSlots="playerSlots"
        :round="roundSlot.round" v-on:update:round="roundUpdated(roundSlot, $event)"
        v-on:validated="roundValidated(roundSlot, $event)"
        :ref="`round${roundSlot.index}`"
        :rules="rules">
      </game-round>
      <!-- Totals -->
      <tbody v-if="ready">
        <tr>
          <th colspan="4" class="uk-text-right">{{ L.totals }}</th>
          <td v-for="playerSlot in playerSlots"
            :key="playerSlot.index">
            {{ totals[playerSlot.index] }}
          </td>
        </tr>
        <!-- Table Points -->
        <tr>
          <th colspan="4" class="uk-text-right">{{ L.table_points }}</th>
          <td v-for="playerSlot in playerSlots"
              :key="playerSlot.index">
            {{ tablePoints[playerSlot.index] }}
          </td>
        </tr>
      </tbody>

    </table>
  </div>
</template>

<script>
import GameRound from '@/components/gameRound';
import GamePlayerChooser from '@/components/gamePlayerChooser';
import rulesSets from '@/business/rulesSets';
import GameMixin from '@/mixins/gameMixin';
import '@/assets/east.png';
import '@/assets/west.png';
import '@/assets/north.png';
import '@/assets/south.png';

export default {
  name: 'Game',
  mixins: [GameMixin],
  data() {
    return {
      // Players
      playerSlots: [{ index: 0, player: { _id: 'epozr', name: 'temp' } },
        { index: 1, player: undefined },
        { index: 2, player: undefined },
        { index: 3, player: undefined }],
      // Rounds
      roundSlots: [],
      // Table point distribution
      rules: rulesSets.mcr,
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
      this.gameService.get(this.game_id).then((response) => {
        if (response.data.status === 'ko') {
          this.$store.commit('message/error', response.data.message);
        } else {
          const game = response.data;
          // Unpacking Rules
          this.rules = rulesSets[game.rules];

          // Unpacking players
          for (let i = 0; i < this.playerSlots.length; i += 1) {
            const playerSlot = this.playerSlots[i];
            if (game.playerSlots !== undefined
              && i < game.playerSlots.length
              && game.playerSlots[i].player != null) {
              playerSlot.player = game.playerSlots[i].player;
            } else {
              playerSlot.player = undefined;
            }
          }
          // Unpacking Rounds
          this.roundSlots = game.roundSlots;
          this.loaded = true;
        }
      }).catch(() => this.messagesService.error('unexpected_error'));
    },
    // Saves the game
    save() {
      this.$nextTick(() => {
        this.gameService.save(this.game_id, {
          roundSlots: this.roundSlots,
          playerSlots: this.playerSlots,
          totals: this.totals,
          tablePoints: this.tablePoints,
          status: this.status,
        });
      });
    },
    // A round is updated, a new round is created if this one is valid
    roundUpdated(roundSlot_, $event) {
      const roundSlot = roundSlot_;
      roundSlot.round = $event;
      if (this.isLastRoundSlot(roundSlot) && this.rules.isValid(roundSlot.round)) {
        const nextRound = this.rules.nextRoundSlot(roundSlot);
        if (nextRound !== undefined) {
          this.roundSlots.push(nextRound);
        }
      }
      this.save();
    },
    // A round is validated (enter pressed => focus next round)
    roundValidated(roundSlot) {
      if (!this.isLastRoundSlot(roundSlot)) {
        this.focusRound(this.roundSlots[roundSlot.index + 1]);
      }
    },
    // Filters players already selected
    playerSuggestionFilter(playerSuggestion) {
      let res = true;
      for (let i = 0; i < this.playerSlots.length; i += 1) {
        const player = this.playerSlots[i].player;
        if (player !== undefined && player._id === playerSuggestion.value._id) {
          res = false;
        }
      }
      return res;
    },
    // Is this the last roundSlot?
    isLastRoundSlot(roundSlot) {
      return roundSlot.index === this.roundSlots.length - 1;
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
      // Creating first round if it does not exists
      if (this.roundSlots.length === 0) {
        this.roundSlots.push(this.rules.nextRoundSlot());
      }
      this.focusRound(this.roundSlots[0]);
    },
    // Change focus to a round
    focusRound(roundSlot) {
      this.$nextTick(() => this.$refs[`round${roundSlot.index}`][0].focus());
    },
  },
  computed: {
    // Players' totals
    totals() {
      return this.rules.totals(this.playerSlots, this.roundSlots);
    },
    // Players' table points
    tablePoints() {
      return this.rules.tablePoints(this.playerSlots, this.roundSlots);
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
      return this.rules.isFinished(this.roundSlots) ? 'ongoing' : 'finished';
    },
  },
  components: {
    'game-round': GameRound,
    'game-player-chooser': GamePlayerChooser,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
