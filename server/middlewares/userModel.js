const mongoose = require('mongoose');
const helpers = require('./modelHelpers');

const schema = mongoose.Schema({
  created: Date,
  updated: Date,
  type: String,
  login: String,
  name: String,
});
schema.pre('save', function presave(next) {
  helpers.preSave(this);
  next();
});
const User = mongoose.model('User', schema);

module.exports = User;
