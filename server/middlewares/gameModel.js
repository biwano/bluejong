const mongoose = require('mongoose');
const helpers = require('./modelHelpers');

const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = mongoose.Schema({
  ownerId: { type: ObjectId, ref: 'User' },
  created: Date,
  updated: Date,
  rules: String,
  playerSlots: [{ index: Number, player: { type: ObjectId, ref: 'Player' } }],
  roundSlots: [{ index: Number,
    round: { wind: String,
      winnerIndex: Number,
      pickedOnIndex: Number,
      score: Number,
      points: [Number],
    } }],
  penaltySlots: [{ index: Number,
    penaltyLine: {
      offenderIndex: Number,
      penalty: Number,
      points: [Number],
    },
  }],
  totals: [Number],
  tablePoints: [Number],
  status: String,
});
// Packing players before save
schema.pre('save', function presave(next) {
  helpers.preSave(this);
  for (let i = 0; i < this.playerSlots.length; i += 1) {
    const slot = this.playerSlots[i];
    if (slot.player !== undefined && slot.player._id !== undefined) {
      slot.player = slot.player._id;
    }
  }
  next();
});
const Game = mongoose.model('Game', schema);

module.exports = Game;
