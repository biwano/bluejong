const mcrRulesSet = {
  name: 'mcr',
  MIN_MAHJONG_SCORE: 8,
  // Creates a round
  nextRoundSlot(previousRoundSlot) {
    let index;
    let wind;
    const score = 0;
    const winnerIndex = this.PLAYER_NOT_CHOSEN;
    const pickedOnIndex = -1;

    // First roundData
    if (previousRoundSlot === undefined) {
      index = 0;
      wind = this.WINDS[0];
    } else {
    // Next Rounds
      index = previousRoundSlot.index + 1;
      if (index >= 16) return undefined;
      let windIndex = this.WINDS.indexOf(previousRoundSlot.round.wind);
      if (index % 4 === 0) windIndex += 1;
      wind = this.WINDS[windIndex];
    }
    return { index, round: { wind, score, winnerIndex, pickedOnIndex } };
  },
  playerRoundPoints(round, playerSlotIndex) {
    const isWinner = this.isWinner(round, playerSlotIndex);
    const isPickedOn = this.isPickedOn(round, playerSlotIndex);
    let points = 0;
    if (!this.isValid(round)) points = 0;
    // Draw
    else if (this.isDraw(round)) points = 0;
    // Self pick
    else if (this.selfPick(round)) {
      // Winner
      if (isWinner) points = (8 + round.score) * 3;
      // Others
      else points = -(8 + round.score);
    // PickedOn
    // Winner
    } else if (isWinner) points = (8 + round.score) + (8 * 2);
    // PickedOn
    else if (isPickedOn) points = -(8 + round.score);
    // Others
    else points = -8;
    return points;
  },
  isFinished(roundSlots) {
    return roundSlots.length === 16;
  },
};
export default mcrRulesSet;
