const express = require('express');
const mailHelper = require('../helpers/mailHelpers');

const router = express.Router();

router.use((req, res, next) => {
  res.Mailer = mailHelper;

  next();
});


module.exports = router;

