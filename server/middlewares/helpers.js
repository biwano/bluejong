const express = require('express');

const router = express.Router();

router.use((req, res, next) => {
  res.sendResponse = function response(err, payload) {
    const status = err ? 'ko' : 'ok';
    const message = err;
    this.json({ status, message, payload });
  };
  next();
});


module.exports = router;

