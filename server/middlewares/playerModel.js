const mongoose = require('mongoose');
const helpers = require('./modelHelpers');

const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = mongoose.Schema({
  ownerId: { type: ObjectId, ref: 'User' },
  created: Date,
  updated: Date,
  name: String,
});
schema.pre('save', function presave(next) {
  helpers.preSave(this);
  next();
});
const Player = mongoose.model('Player', schema);

module.exports = Player;
