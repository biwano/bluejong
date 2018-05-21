import mcrRulesSet from './mcrRulesSet';

const rulesSetBase = {
  // Dictionnary of all known rules
  TABLE_POINTS_LIST: [0, 1, 2, 4],
  WINDS: ['east', 'south', 'west', 'north'],
  MIN_MAHJONG_SCORE: 0,
  ROUND_DRAW: -2,
  PLAYER_NOT_CHOSEN: -1,
  // Is the player is the winner of the round
  isWinner(round, playerSlotIndex) {
    return round.winnerIndex === playerSlotIndex;
  },
  // Is the player was picked on in the round
  isPickedOn(round, playerSlotIndex) {
    return round.pickedOnIndex === playerSlotIndex
      && !this.isWinner(round, playerSlotIndex)
      && !this.isDraw(round);
  },
  // Is this a self pick round
  selfPick(round) {
    return round.winnerIndex === round.pickedOnIndex;
  },
  // Is the round valid
  isValid(round) {
    return (round.winnerIndex !== this.PLAYER_NOT_CHOSEN &&
      round.pickedOnIndex !== this.PLAYER_NOT_CHOSEN &&
      round.score >= this.MIN_MAHJONG_SCORE) ||
      this.isDraw(round);
  },
  // Is it a draw round
  isDraw(round) {
    return round.winnerIndex === this.ROUND_DRAW;
  },
  // Is the penalty line completed properly
  isPenaltyLineValid(penaltyLine) {
    return penaltyLine.offenderIndex !== this.PLAYER_NOT_CHOSEN &&
      penaltyLine.penalty > 0;
  },
  // Is the player is the offender of the penalty line
  isOffender(penaltyLine, playerSlotIndex) {
    return penaltyLine.offenderIndex === playerSlotIndex;
  },
  // Computes the totals of players
  totals(playerSlots, roundSlots, penaltySlots) {
    const totals = new Array(playerSlots.length);
    // For each player
    for (let i = 0; i < playerSlots.length; i += 1) {
      const playerSlot = playerSlots[i];
      let total = 0;
      // Adding points of all valid rounds
      for (let j = 0; j < roundSlots.length; j += 1) {
        const round = roundSlots[j].round;
        if (this.isValid(round)) total += round.points[playerSlot.index];
        else break;
      }
      // Adding points of all valid penaltyLines
      for (let j = 0; j < penaltySlots.length; j += 1) {
        const penaltyLine = penaltySlots[j].penaltyLine;
        if (this.isPenaltyLineValid(penaltyLine)) total += penaltyLine.points[playerSlot.index];
        else break;
      }
      totals[playerSlot.index] = total;
    }
    return totals;
  },
  // Compute the pealty line points for a player
  playerPenaltyLinePoints(penaltyLine, playerSlotIndex) {
    const isOffender = this.isOffender(penaltyLine, playerSlotIndex);
    let points;
    if (!this.isPenaltyLineValid(penaltyLine)) points = 0;
    // Draw
    if (isOffender) points = -(penaltyLine.penalty) * 3;
    else points = penaltyLine.penalty;
    return points;
  },
  // compute the table points of the players
  tablePoints(playerSlots, roundSlots, penaltySlots) {
    const totals = this.totals(playerSlots, roundSlots, penaltySlots);
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
      for (let k = i; k < j; k += 1) sharedPoints += this.TABLE_POINTS_LIST[k];
      sharedPoints /= j - i;

      // Attributing shared points to players i to j
      for (let k = i; k < j; k += 1) tablePoints[totalsArray[k].playerSlotIndex] = sharedPoints;
      i = j;
    }
    return tablePoints;
  },
  // creates a new penaltySlot
  newPenaltySlot(previousPenaltySlot) {
    const offenderIndex = -1;
    const penalty = 0;
    const index = previousPenaltySlot === undefined ? 0 : previousPenaltySlot.index + 1;

    return { index, penaltyLine: { offenderIndex, penalty } };
  },
};
const rulesSets = {};
const appendRulesSet = function appendRulesSet(rule) {
  const _rule = Object.assign({}, rulesSetBase, rule);
  rulesSets[_rule.name] = _rule;
};
appendRulesSet(mcrRulesSet);

export default rulesSets;
