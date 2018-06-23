const Player = require('./playerModel');
const Game = require('./gameModel');
const User = require('./userModel');
const Tournament = require('./tournamentModel');


module.exports = {
  Player,
  Game,
  User,
  Tournament,
  /*
  assign: function assign(destination, source) {
    const dest = destination;
    Object.keys(source).forEach((key) => {
      dest[key] = source[key];
    });
  },
  */
};
