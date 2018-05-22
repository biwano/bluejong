const express = require('express');
const config = require('../config.js');

const router = express.Router();

const initData = async (M) => {
  try {
    await M.Player.remove({});
  } catch (e) {
    console.error(e);
    return false;
  }
  return true;
};
router.get('/init', (req, res) => {
  res.json({ status: initData(res.M) });
});
router.get('/version', (req, res) => {
  res.json({ version: config.version });
});
module.exports = router;
