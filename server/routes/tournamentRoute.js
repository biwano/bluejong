const express = require('express');

const router = express.Router();
const solver = require('../business/tournamentSolver');

// Create tournament
router.put('/', async (req, res) => {
  try {
    let tournament = res.M.Tournament(req.body);
    tournament.ownerId = req.user._id;
    tournament = await tournament.save();
    res.sendData(tournament);
  } catch (err) {
    res.sendException(err);
  }
});

// Initialize tournament rounds
router.post('/:id/rounds', async (req, res) => {
  try {
    const players = new Array(8);
    for (let i = 0; i < players.length; i += 1) players[i] = i;
    const nbRounds = 15;
    const result = await solver.solve(players, nbRounds);
    res.sendData(result);
  } catch (err) {
    res.sendException(err);
  }
});

// Update game
/*
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
*/
// Get tournament
router.get('/:id', async (req, res) => {
  try {
    const tournament = await res.M.Tournament.findOne({ ownerId: req.user._id, _id: req.params.id })
      .populate('playerSlots.player').exec();
    if (tournament === null) res.sendError('tournament_not_found');
    else res.sendData(tournament);
  } catch (err) {
    res.sendException(err);
  }
});
/*
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
*/
module.exports = router;
