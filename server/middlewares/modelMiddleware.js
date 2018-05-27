const express = require('express');
const Model = require('../models/models');

const router = express.Router();

router.use((req, res, next) => {
  res.M = Model;
  next();
});

module.exports = router;

