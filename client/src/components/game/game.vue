<template>
  <div>
    <div v-if="!loaded" uk-spinner="ratio: 3"></div>
    <table v-if="loaded" class="uk-table">
      <!-- Header -->
      <thead>
        <tr class="uk-table-middle">
          <th class="uk-text-center" v-if="ready">{{ L.wind }}</th>
          <th class="uk-text-center" v-if="ready">{{ L.winner }}</th>
          <th class="uk-text-center" v-if="ready">{{ L.picked_on }}</th>
          <th class="uk-text-center" v-if="ready">{{ L.points }}</th>
          <th v-for="playerSlot in game.playerSlots" :key="playerSlot.index">
            <player-chooser
              v-model="playerSlot.player"
              @input="playerUpdated(playerSlot)"
              :suggestionFilter="playerSuggestionFilter"
              :placeholder="playerChooserPlaceholder(playerSlot)"
              :ref="`chooser${playerSlot.index}`">
            </player-chooser>
          </th>
        </tr>
      </thead>
      <!-- Hands -->
      <tbody>
        <game-hand v-for="handSlot in game.handSlots" :key="handSlot.index"
          :playerSlots="game.playerSlots"
          :hand="handSlot.hand" v-on:update:hand="handUpdated(handSlot, $event)"
          @validated="handValidated(handSlot, $event)"
          :ref="`hand${handSlot.index}`"
          :rules="game.rules">
        </game-hand>
      </tbody>
      <!-- Penalty lines -->
      <tbody :hidden="game.penaltySlots.length===0">
        <tr>
          <th></th>
          <th class="uk-text-center" colspan="2">{{ L.offender }}</th>
          <th class="uk-text-center">{{ L.penalty }}</th>
          <th v-for="playerSlot in game.playerSlots" :key="playerSlot.index">
            <span v-if="playerSlot.player">{{ playerSlot.player.name }}</span>
          </th>
        </tr>
        <penalty-line v-for="penaltySlot in game.penaltySlots" :key="penaltySlot.index"
          :playerSlots="game.playerSlots"
          :penaltyLine="penaltySlot.penaltyLine"
          @update:penaltyLine="penaltyLineUpdated(penaltySlot, $event)"
          :ref="`penaltyLine${penaltySlot.index}`"
          :rules="game.rules">
        </penalty-line>
      </tbody>
      <!-- Add Penalty -->
      <tbody v-if="penaltyReady">
        <tr>
          <th colspan="8">
            <button class="uk-button uk-button-primary" @click="addPenalty()">
              {{ L.add_penalty }}
            </button>
          </th>
        </tr>
      </tbody>
      <!-- Totals -->
      <tbody v-if="ready">
        <!-- Player list -->
        <tr>
          <th colspan="4"></th>
          <th v-for="playerSlot in game.playerSlots" :key="playerSlot.index">
            <span v-if="playerSlot.player">{{ playerSlot.player.name }}</span>
          </th>
        </tr>
        <!-- Scores -->
        <tr>
          <th colspan="4" class="uk-text-right">{{ L.totals }}</th>
          <td v-for="playerSlot in game.playerSlots"
            :key="playerSlot.index">
            {{ game.totals[playerSlot.index] }}
          </td>
        </tr>
        <!-- Table Points -->
        <tr>
          <th colspan="4" class="uk-text-right">{{ L.table_points }}</th>
          <td v-for="playerSlot in game.playerSlots"
              :key="playerSlot.index">
            {{ game.tablePoints[playerSlot.index] }}
          </td>
        </tr>
      </tbody>

    </table>
  </div>
</template>

<script>
import '@/assets/east.png';
import '@/assets/west.png';
import '@/assets/north.png';
import '@/assets/south.png';
import debounce from 'lodash.debounce';
import rulesSets from '@/business/rulesSets';
import GameMixin from '@/mixins/gameMixin';
import PlayerChooser from '../player/playerChooser';
import GameHand from './gameHand';
import PenaltyLine from './penaltyLine';

export default {
  name: 'Game',
  mixins: [GameMixin],
  data() {
    return {
      // Players
      game: {
        playerSlots: [{ index: 0, player: undefined },
          { index: 1, player: undefined },
          { index: 2, player: undefined },
          { index: 3, player: undefined }],
        // Hands
        handSlots: [],
        penaltySlots: [],
        // Table point distribution
        rules: rulesSets.mcr,
        totals: [0, 0, 0, 0],
        tablePoints: [0, 0, 0, 0],
      },
      loaded: false,
    };
  },
  beforeRouteUpdate(to, from, next) {
    this.load();
    next();
  },
  created() {
    this.save = debounce(this.save, 500);
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
    // A hand is updated, a new hand is created if this one is valid
    handUpdated(handSlot_, hand) {
      const handSlot = handSlot_;
      handSlot.hand = hand;
      if (this.isLastHandSlot(handSlot) && this.game.rules.isValid(handSlot.hand)) {
        const nextHand = this.game.rules.nextHandSlot(handSlot);
        if (nextHand !== undefined) {
          this.game.handSlots.push(nextHand);
        }
      }
      this.save();
    },
    // A penaltyLine is updated
    penaltyLineUpdated(penaltySlot_, penaltyLine) {
      const penaltySlot = penaltySlot_;
      penaltySlot.penaltyLine = penaltyLine;
      this.save();
    },
    // A hand is validated (enter pressed => focus next hand)
    handValidated(handSlot) {
      if (!this.isLastHandSlot(handSlot)) {
        this.focusHand(this.game.handSlots[handSlot.index + 1]);
      }
    },
    // Filters players already selected
    playerSuggestionFilter(playerSuggestion) {
      let res = true;
      for (let i = 0; i < this.game.playerSlots.length; i += 1) {
        const player = this.game.playerSlots[i].player;
        if (player !== undefined && player._id === playerSuggestion.value._id) {
          res = false;
        }
      }
      return res;
    },
    // Is this the last handSlot?
    isLastHandSlot(handSlot) {
      return handSlot.index === this.game.handSlots.length - 1;
    },
    // A player was updated
    playerUpdated(playerSlot) {
      this.focusPlayer(playerSlot.index);
      this.save();
    },
    // Change focus when a player is updated
    focusPlayer(index) {
      // To the next undefined player
      for (let i = 0; i < this.game.playerSlots.length; i += 1) {
        if (i !== index) {
          const playerSlot = this.game.playerSlots[i];
          if (playerSlot.player === undefined) {
            this.$refs[`chooser${playerSlot.index}`][0].editMode();
            return;
          }
        }
      }
      // Creating first hand if it does not exists
      if (this.game.handSlots.length === 0) {
        this.game.handSlots.push(this.game.rules.nextHandSlot());
      }
      this.focusHand(this.game.handSlots[0]);
    },
    // Change focus to a hand
    focusHand(handSlot) {
      this.$nextTick(() => this.$refs[`hand${handSlot.index}`][0].focus());
    },
    // placeholder for player chooser
    playerChooserPlaceholder(playerSlot) {
      return this.L[`select_player_${this.game.rules.WINDS[playerSlot.index]}`];
    },
    // adds a pealty splot
    addPenalty() {
      this.game.penaltySlots.push(this.game.rules.newPenaltySlot(this.lastPenaltySlot));
    },
  },
  computed: {
    // game ready if all players are filled
    ready() {
      let ready = true;
      for (let i = 0; i < this.game.playerSlots.length; i += 1) {
        if (this.game.playerSlots[i].player === undefined) ready = false;
      }
      return ready;
    },
    // Last PenaltySlot
    lastPenaltySlot() {
      return this.game.penaltySlots[this.game.penaltySlots.length - 1];
    },
    // Can we add a new penalty
    penaltyReady() {
      return this.ready && (this.game.penaltySlots.length === 0 ||
        this.game.rules.isPenaltyLineValid(this.lastPenaltySlot.penaltyLine));
    },
  },
  components: {
    'game-hand': GameHand,
    'penalty-line': PenaltyLine,
    'player-chooser': PlayerChooser,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
