const mongoose = require('mongoose');
const config = require('../config.js');
const logger = require('./loggerHelpers');

const helpers = {
  connect: function connect() {
    mongoose.connect(config.persistence.url);
    const db = mongoose.connection;
    db.on('error', logger.error);
    return db;
  },
};


module.exports = helpers;

