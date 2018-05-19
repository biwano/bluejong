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
    console.log(err);
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
    console.log(err);
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
    console.log(err);
    res.json(res.sendResponse('game_error'));
  }
});

module.exports = router;
