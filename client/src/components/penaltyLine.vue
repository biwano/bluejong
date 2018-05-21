<template>
    <tr>
      <!-- TODO: Icon -->
      <th>

      </th>
      <!-- Offender -->
      <th colspan="2">
        <select class="uk-select"
          v-model.number="offenderIndex"
          ref="offender"
          @input="focus()">
          <option :value="this.rules.PLAYER_NOT_CHOSEN">{{ L.choose }}</option>
          <option v-for="playerSlot in playerSlots"
            :key="playerSlot.index"
            :value="playerSlot.index">
            <span>{{ playerName(playerSlot)}}</span>
          </option>
          <option :value="this.rules.ROUND_DRAW">{{ L.draw }}</option>
        </select>
      </th>
      <!-- Penalty -->
      <th><input class="uk-input points"
        type="number"
        v-model.number="penalty"
        ref="penalty"
        :hidden="!offenderChosen"
        @keyup.enter="$emit('validated', penaltyLine)"/>
      </th>
      <!-- Player points -->
      <td v-for="playerSlot in playerSlots" :key="playerSlot.index"
        v-if="rules.isPenaltyLineValid(newData)"
        :class="{ 'uk-alert-danger': rules.isOffender(newData, playerSlot.index) }">
        {{ newData.points[playerSlot.index] }}
      </td>
    </tr>


</template>

<script>
export default {
  name: 'penaltyLine',
  props: ['playerSlots', 'penaltyLine', 'rules'],
  data() {
    return {
      offenderIndex: this.penaltyLine.offenderIndex,
      penalty: this.penaltyLine.penalty,
    };
  },
  created() {
  },
  methods: {
    compute() {
      const newData = {
        offenderIndex: this.offenderIndex,
        penalty: this.penalty,
        points: new Array(this.playerSlots.length),
      };
      newData.valid = this.rules.isValid(newData);

      for (let i = 0; i < this.playerSlots.length; i += 1) {
        const index = this.playerSlots[i].index;
        newData.points[index] = this.rules.playerPenaltyLinePoints(newData, index);
      }
      this.$emit('update:penaltyLine', newData);
      return newData;
    },
    focus() {
      this.$nextTick(() => {
        if (this.offenderIndex === this.rules.PLAYER_NOT_CHOSEN) this.$refs.offender.focus();
        else this.$refs.penalty.focus();
      });
    },
    playerName(playerSlot) {
      return playerSlot.player !== undefined ? playerSlot.player.name : undefined;
    },
  },
  computed: {
    newData() {
      return this.compute();
    },
    offenderChosen() {
      return this.offenderIndex !== this.rules.PLAYER_NOT_CHOSEN;
    },
  },
};
</script>
<style scoped>
.offender {
  background-color: #fee;
}
.penalty {
  width:60px;
}
</style>
