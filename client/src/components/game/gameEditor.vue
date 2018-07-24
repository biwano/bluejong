s<template>
  <div>
    <table class="uk-table">
      <!-- Header -->
      <thead>
        <tr class="uk-table-middle">
          <th class="uk-text-center" >{{ L.wind }}</th>
          <th class="uk-text-center" >{{ L.winner }}</th>
          <th class="uk-text-center" >{{ L.picked_on }}</th>
          <th class="uk-text-center" >{{ L.points }}</th>
          <th class="uk-text-center" v-for="playerSlot in game.playerSlots" :key="playerSlot.index">
            <span class="uk-label"
              draggable="true"
              @dragstart="onDragPlayer($event, playerSlot)"
              @drop="onDropPlayer($event, playerSlot)"
              @dragover="$event.preventDefault()">
              {{ playerSlot.player.name }}
            </span>
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
          <th class="uk-text-center" v-for="playerSlot in game.playerSlots" :key="playerSlot.index">
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
      <tbody>
        <!-- Player list -->
        <tr>
          <th colspan="4"></th>
          <th class="uk-text-center" v-for="playerSlot in game.playerSlots" :key="playerSlot.index">
            <span v-if="playerSlot.player">{{ playerSlot.player.name }}</span>
          </th>
        </tr>
        <!-- Scores -->
        <tr>
          <th colspan="4" class="uk-text-right">{{ L.totals }}</th>
          <td class="uk-text-center" v-for="playerSlot in game.playerSlots"
            :key="playerSlot.index">
            {{ game.totals[playerSlot.index] }}
          </td>
        </tr>
        <!-- Table Points -->
        <tr>
          <th colspan="4" class="uk-text-right">{{ L.table_points }}</th>
          <td  class="uk-text-center" v-for="playerSlot in game.playerSlots"
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
import { GameMixin, GameService } from '@/mixins/gameMixin';
import PlayerMixin from '@/mixins/playerMixin';
import GameHand from './gameHand';
import PenaltyLine from './penaltyLine';

export default {
  name: 'GameEditor',
  mixins: [GameMixin, PlayerMixin],
  props: ['value'],
  data() {
    return {
      game: GameService.gameModel,
    };
  },
  created() {
    this.save = debounce(this.save, 500);
    this.game = this.value;
    if (this.game.handSlots.length === 0) {
      this.game.handSlots.push(this.game.rules.nextHandSlot());
    }
    // And focussing this hand
    this.focusHand(this.game.handSlots[0]);
  },
  watch: {
    value(val) {
      this.game = val;
    },
  },
  methods: {
    // Saves the game
    save() {
      this.$emit('input', this.game);
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
    // Is this the last handSlot?
    isLastHandSlot(handSlot) {
      return handSlot.index === this.game.handSlots.length - 1;
    },
    // Change focus to a hand
    focusHand(handSlot) {
      this.$nextTick(() => this.$refs[`hand${handSlot.index}`][0].focus());
    },
    // Placeholder for player chooser
    playerChooserPlaceholder(playerSlot) {
      return this.L[`select_player_${this.game.rules.playerWind(playerSlot)}`];
    },
    // Adds a pealty splot
    addPenalty() {
      this.game.penaltySlots.push(this.game.rules.newPenaltySlot(this.lastPenaltySlot));
    },
    // Drag a player
    onDragPlayer(event, playerSlot) {
      event.dataTransfer.setData('index', String(playerSlot.index));
    },
    // Drop a player
    onDropPlayer(event, playerSlot_) {
      event.preventDefault();
      const playerSlot = playerSlot_;
      const playerSlotIndex = Number(event.dataTransfer.getData('index'));
      const sourcePlayerSlot = this.game.playerSlots[playerSlotIndex];
      if (sourcePlayerSlot !== undefined) {
        const playerTmp = playerSlot.player;
        playerSlot.player = sourcePlayerSlot.player;
        sourcePlayerSlot.player = playerTmp;
        this.save();
      }
    },
  },
  computed: {
    // Last PenaltySlot
    lastPenaltySlot() {
      return this.game.penaltySlots[this.game.penaltySlots.length - 1];
    },
    // Can we add a new penalty
    penaltyReady() {
      return (this.game.penaltySlots.length === 0 ||
        this.game.rules.isPenaltyLineValid(this.lastPenaltySlot.penaltyLine));
    },
  },
  components: {
    'game-hand': GameHand,
    'penalty-line': PenaltyLine,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
