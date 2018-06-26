const mcrRulesSet = {
  name: 'mcr',
  MIN_MAHJONG_SCORE: 8,
  // Creates a hand
  nextHandSlot(previousHandSlot) {
    let index;
    let wind;
    const score = 0;
    const winnerIndex = this.PLAYER_NOT_CHOSEN;
    const pickedOnIndex = -1;

    // First handData
    if (previousHandSlot === undefined) {
      index = 0;
      wind = this.WINDS[0];
    } else {
    // Next Hands
      index = previousHandSlot.index + 1;
      if (index >= 16) return undefined;
      let windIndex = this.WINDS.indexOf(previousHandSlot.hand.wind);
      if (index % 4 === 0) windIndex += 1;
      wind = this.WINDS[windIndex];
    }
    return { index, hand: { wind, score, winnerIndex, pickedOnIndex } };
  },
  playerHandPoints(hand, playerSlotIndex) {
    const isWinner = this.isWinner(hand, playerSlotIndex);
    const isPickedOn = this.isPickedOn(hand, playerSlotIndex);
    let points = 0;
    if (!this.isValid(hand)) points = 0;
    // Draw
    else if (this.isDraw(hand)) points = 0;
    // Self pick
    else if (this.selfPick(hand)) {
      // Winner
      if (isWinner) points = (8 + hand.score) * 3;
      // Others
      else points = -(8 + hand.score);
    // PickedOn
    // Winner
    } else if (isWinner) points = (8 + hand.score) + (8 * 2);
    // PickedOn
    else if (isPickedOn) points = -(8 + hand.score);
    // Others
    else points = -8;
    return points;
  },
  isFinished(game) {
    return game.handSlots.length === 16;
  },
};
export default mcrRulesSet;
