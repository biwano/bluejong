const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = mongoose.Schema({
  ownerId: { type: ObjectId, ref: 'User' },
  name: String,
});
const Player = mongoose.model('Player', schema);

module.exports = Player;
