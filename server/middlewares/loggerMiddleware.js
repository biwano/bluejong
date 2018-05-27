const express = require('express');
const logger = require('../helpers/loggerHelpers.js');

const router = express.Router();

router.use(async (req, res, next) => {
  res.Logger = logger;
  next();
});

module.exports = router;

