const express = require('express');

const router = express.Router();

// Create game
router.put('/', async (req, res) => {
  try {
    let game = res.M.Game(req.body);
    game.ownerId = req.user._id;
    game = await game.save();
    res.sendData(game);
  } catch (err) {
    res.sendException(err);
  }
});

// Update game
router.post('/:id', async (req, res) => {
  try {
    let game = await res.M.Game.findOne({ ownerId: req.user._id, _id: req.params.id })
      .populate('playerSlots.player').exec();
    Object.assign(game, req.body);
    game = await game.save();
    res.sendData(game);
  } catch (err) {
    res.sendException(err);
  }
});

// Get game
router.get('/:id', async (req, res) => {
  try {
    const game = await res.M.Game.findOne({ ownerId: req.user._id, _id: req.params.id })
      .populate('playerSlots.player').exec();
    if (game === null) res.sendError('game_not_found');
    else res.sendData(game);
  } catch (err) {
    res.sendException(err);
  }
});
// Delete game
router.delete('/:id', async (req, res) => {
  try {
    const game = await res.M.Game.findOne({ ownerId: req.user._id, _id: req.params.id });
    if (game === null) res.sendError('game_not_found');
    else {
      game.status = 'deleted';
      game.save();
      res.sendSuccess();
    }
  } catch (err) {
    res.sendException(err);
  }
});
// Get all active games
router.get('/', async (req, res) => {
  try {
    const games = await res.M.Game.find({
      ownerId: req.user._id,
      status: { $ne: 'deleted' } })
      .limit(10)
      .sort({ created: -1 })
      .populate('playerSlots.player')
      .exec();
    res.sendData(games);
  } catch (err) {
    res.sendException(err);
  }
});

module.exports = router;
