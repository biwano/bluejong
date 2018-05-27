const express = require('express');

const router = express.Router();

router.use((req, res, next) => {
  res.sendResponse = function response(err, payload) {
    const status = err ? 'ko' : 'ok';
    const message = err;
    res.json({ status, message, payload });
  };
  res.sendSuccess = function success() {
    res.sendResponse();
  };
  res.sendError = function error(err, payload) {
    res.sendResponse(err, payload);
  };
  res.sendUnexpectedError = function unexpected(err) {
    res.Logger.error(err);
    res.sendResponse('error_unexpected', err);
  };
  res.sendException = function unexpected(exception) {
    res.Logger.exception(exception);
    res.sendResponse('error_unexpected', exception);
  };
  res.sendData = function sendData(data) {
    res.Logger.debug(data);
    res.json(data);
  };
  next();
});


module.exports = router;

