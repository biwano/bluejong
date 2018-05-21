const express = require('express');

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
module.exports = router;
