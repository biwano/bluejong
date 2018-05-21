const express = require('express');

const router = express.Router();

// Create game
router.put('/', async (req, res) => {
  try {
    let game = res.M.Game(req.body);
    game.ownerId = req.user._id;
    game = await game.save();
    res.json(game);
  } catch (err) {
    console.error(err);
    res.json(res.sendResponse('game_error'));
  }
});

// Update game
router.post('/:id', async (req, res) => {
  try {
    let game = await res.M.Game.findOne({ ownerId: req.user._id, _id: req.params.id })
      .populate('playerSlots.player').exec();
    Object.assign(game, req.body);
    game = await game.save();
    res.json(game);
  } catch (err) {
    console.error(err);
    res.json(res.sendResponse('game_error'));
  }
});

// Get game
router.get('/:id', async (req, res) => {
  try {
    const game = await res.M.Game.findOne({ ownerId: req.user._id, _id: req.params.id })
      .populate('playerSlots.player').exec();
    if (game === null) res.sendResponse('game_not_found');
    else res.json(game);
  } catch (err) {
    console.error(err);
    res.json(res.sendResponse('game_error'));
  }
});
// Delete game
router.delete('/:id', async (req, res) => {
  try {
    const game = await res.M.Game.findOne({ ownerId: req.user._id, _id: req.params.id })
      .populate('playerSlots.player').exec();
    if (game === null) res.sendResponse('game_not_found');
    else {
      game.status = 'deleted';
      game.save();
      res.sendResponse();
    }
  } catch (err) {
    console.log(err);
    res.json(res.sendResponse('game_error'));
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
    res.json(games);
  } catch (err) {
    console.log(err);
    res.json(res.sendResponse('game_error'));
  }
});

module.exports = router;
