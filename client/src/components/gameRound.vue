<template>
  <tbody :hidden="!visible">
    <tr>
      <!-- Wind -->
      <th>
        <img :src="windURL"/>
      </th>
      <!-- Winner -->
      <th>
        <select class="uk-select"
          v-model.number="winnerIndex"
          ref="winner"
          @input="focus()">
          <option value="-1">{{ L.choose }}</option>
          <option v-for="playerSlot in playerSlots"
            :key="playerSlot.index"
            :value="playerSlot.index">
            <span>{{ playerName(playerSlot)}}</span>
          </option>
        </select>
      </th>
      <!-- Picked on -->
      <th>
        <select class="uk-select"
          v-model.number="pickedOnIndex"
          ref="pickedOn"
          @input="focus()">
          <option value="-1">{{ L.choose }}</option>
          <option v-for="playerSlot in playerSlots"
            :key="playerSlot.index"
            :value="playerSlot.index">

            {{ pickedOnName(playerSlot) }}
          </option>
        </select>
      </th>
      <!-- Score -->
      <th><input class="uk-input points"
        type="number"
        v-model.number="score"
        ref="score"
        @keyup.enter="$emit('validated', round)"/>
      </th>
      <!-- Player points -->
      <td v-for="playerSlot in playerSlots" :key="playerSlot.index"  v-if="rules.isValid(newData)"
        :class="{ 'uk-alert-success': rules.isWinner(newData, playerSlot.index),
        'uk-alert-danger': rules.isPickedOn(newData, playerSlot.index) }">
        {{ newData.points[playerSlot.index] }}
      </td>
    </tr>
  </tbody>


</template>

<script>
export default {
  name: 'GameRound',
  props: ['playerSlots', 'round', 'visible', 'rules'],
  data() {
    return {
      winnerIndex: this.round.winnerIndex,
      pickedOnIndex: this.round.pickedOnIndex,
      score: this.round.score,
      wind: this.round.wind,
    };
  },
  created() {
  },
  methods: {
    compute() {
      const newData = {
        wind: this.wind,
        winnerIndex: this.winnerIndex,
        pickedOnIndex: this.pickedOnIndex,
        score: this.score,
        points: new Array(this.playerSlots.length),
        // points: {},
        // totalPoints: {},
      };
      newData.valid = this.rules.isValid(newData);

      for (let i = 0; i < this.playerSlots.length; i += 1) {
        const index = this.playerSlots[i].index;
        newData.points[index] = this.rules.playerRoundPoints(newData, index);
      }
      this.$emit('update:round', newData);
      return newData;
    },
    focus() {
      this.$nextTick(() => {
        if (this.winnerIndex === -1) this.$refs.winner.focus();
        else if (this.pickedOnIndex === -1) this.$refs.pickedOn.focus();
        else this.$refs.score.focus();
      });
    },
    playerName(playerSlot) {
      return playerSlot.player !== undefined ? playerSlot.player.name : undefined;
    },
    pickedOnName(playerSlot) {
      return playerSlot.index === this.winnerIndex ? 'Self pick' : this.playerName(playerSlot);
    },
  },
  computed: {
    newData() {
      return this.compute();
    },
    windURL() {
      const file = { E: 'east.png',
        W: 'west.png',
        N: 'north.png',
        S: 'south.png' }[this.round.wind];
      return `../static/img/${file}`;
    },
  },
};
</script>
<style scoped>
.winner {
  background-color: #efe;
}
.pickedOn {
  background-color: #fee;
}
.points {
  width:60px;
}
</style>
