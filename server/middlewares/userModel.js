const mongoose = require('mongoose');

const schema = mongoose.Schema({
  login: String,
});
const User = mongoose.model('User', schema);

module.exports = User;
