const express = require('express');

const router = express.Router();

// Create player
router.post('/', async (req, res) => {
  try {
    const exists = await res.M.Player.findOne({ ownerId: req.user._id, name: req.body.name });
    if (exists !== null) {
      res.sendError('player_exists', exists);
    } else {
      let player = res.M.Player(req.body);
      player.ownerId = req.user._id;
      player = await player.save();
      res.sendData(player);
    }
  } catch (err) {
    res.sendException(err);
  }
});

// Search players
router.get('/search/:query?', async (req, res) => {
  try {
    const players = await res.M.Player.find({ ownerId: req.user._id, name: new RegExp(req.params.query, 'i') });
    res.sendData(players);
  } catch (err) {
    res.sendException(err);
  }
});

// Find player
router.get('/:id', async (req, res) => {
  try {
    const player = await res.M.Player.findById({ ownerId: req.user._id, _id: req.params.id });
    res.sendData(player);
  } catch (err) {
    res.sendException(err);
  }
});

module.exports = router;
