const mongoose = require('mongoose');
const helpers = require('../helpers/modelHelpers');

const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = mongoose.Schema({
  ownerId: { type: ObjectId, ref: 'User' },
  created: Date,
  updated: Date,
  teamTournament: { type: Boolean, default: false },
  teamsSize: { type: Number, default: 1 },
  roundModel: { type: String, default: 'min_encounters' },
  rules: String,
  nbTables: { type: Number, default: 0 },
  nbRounds: { type: Number, default: 0 },
  name: String,
  playerSlots: [{ index: Number, player: { type: ObjectId, ref: 'Player' } }],
  roundSlots: [{ index: Number,
    round: {
      tables: [{
        index: Number,
        playerSlotIndexes: [Number],
      }],
    },
  }],
  totals: {},
  tablePoints: {},
  status: String,
});
schema.pre('save', function presave(next) {
  helpers.preSave(this);
  // Packing players before save
  helpers.packPlayers(this.playerSlots);
  for (let i = 0; i < this.roundSlots.length; i += 1) {
    const round = this.roundSlots[i];
    for (let j = 0; j < round.tables.length; j += 1) {
      const table = round.tables[j];
      helpers.packPlayers(table.playerSlots);
    }
  }
  next();
});
const Tournament = mongoose.model('Tournament', schema);

module.exports = Tournament;
