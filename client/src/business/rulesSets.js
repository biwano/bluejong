import mcrRulesSet from './mcrRulesSet';

const rulesSetBase = {
  // Dictionnary of all known rules
  tablePointsList: [0, 1, 2, 4],
  winds: ['E', 'S', 'W', 'N'],
  minMahjongScore: 0,
  // Is the player is the winner of the round
  isWinner(round, playerSlotIndex) {
    return round.winnerIndex === playerSlotIndex;
  },
  // Is the player was picked on in the round
  isPickedOn(round, playerSlotIndex) {
    return round.pickedOnIndex === playerSlotIndex && !this.isWinner(round, playerSlotIndex);
  },
  // Is this a self pick round
  selfPick(round) {
    return round.winnerIndex === round.pickedOnIndex;
  },
  // Is the round valid
  isValid(round) {
    return round.winnerIndex !== -1 &&
      round.pickedOnIndex !== -1 &&
      round.score >= this.minMahjongScore;
  },
  // Computes the totals of players
  totals(playerSlots, roundSlots) {
    const totals = new Array(playerSlots.length);
    // For each player
    for (let i = 0; i < playerSlots.length; i += 1) {
      const playerSlot = playerSlots[i];
      let total = 0;
      // Adding totals of all valid rounds
      for (let j = 0; j < roundSlots.length; j += 1) {
        const roundSlot = roundSlots[j];
        if (this.isValid(roundSlot.round)) total += roundSlot.round.points[playerSlot.index];
        else break;
      }
      totals[playerSlot.index] = total;
    }
    return totals;
  },
  // compute the table points of the players
  tablePoints(playerSlots, roundSlots) {
    const totals = this.totals(playerSlots, roundSlots);
    const totalsArray = [];
    const tablePoints = new Array(playerSlots.length);
    // Sorting player totals in totals array
    for (let i = 0; i < playerSlots.length; i += 1) {
      const playerSlot = playerSlots[i];
      totalsArray.push({ playerSlotIndex: playerSlot.index, total: totals[playerSlot.index] });
    }
    totalsArray.sort((p1, p2) => p1.total - p2.total);
    // Computing table points of the players
    // i: current player
    let i = 0;
    while (i < playerSlots.length) {
      let j = i;
      // j: last player with the same total
      while (j < playerSlots.length && totalsArray[j].total === totalsArray[i].total) {
        j += 1;
      }
      // sharedpoints:  sum of points to be shared between players i to j
      //                divided by numer of players
      let sharedPoints = 0;
      for (let k = i; k < j; k += 1) sharedPoints += this.tablePointsList[k];
      sharedPoints /= j - i;

      // Attributing shared points to players i to j
      for (let k = i; k < j; k += 1) tablePoints[totalsArray[k].playerSlotIndex] = sharedPoints;
      i = j;
    }
    return tablePoints;
  },
};
const rulesSets = {};
const appendRulesSet = function appendRulesSet(rule) {
  const _rule = Object.assign({}, rulesSetBase, rule);
  rulesSets[_rule.name] = _rule;
};
appendRulesSet(mcrRulesSet);

export default rulesSets;
