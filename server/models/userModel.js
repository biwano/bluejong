const mongoose = require('mongoose');
const helpers = require('../helpers/modelHelpers');

const schema = mongoose.Schema({
  created: Date,
  updated: Date,
  type: String,
  name: String,
  auth: {
    login: String,
    password: String,
    salt: String,
    roles: [String],
  },
});
schema.pre('save', function presave(next) {
  helpers.preSave(this);
  next();
});
const User = mongoose.model('User', schema);

module.exports = User;
