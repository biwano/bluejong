const mongoose = require('mongoose');
const helpers = require('../helpers/modelHelpers');

const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = mongoose.Schema({
  ownerId: { type: ObjectId, ref: 'User' },
  created: Date,
  updated: Date,
  rules: String,
  playerSlots: [{ index: Number, player: { type: ObjectId, ref: 'Player' } }],
  handSlots: [{ index: Number,
    hand: { wind: String,
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
  tournamentId: { type: ObjectId, ref: 'Tournament' },
  tournamentTableIndex: Number,
  tournamentRoundIndex: Number,
  totals: {},
  tablePoints: {},
  status: String,
});
schema.pre('save', function presave(next) {
  helpers.preSave(this);
  // Packing players before save
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
