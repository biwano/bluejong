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

// Compute rounds for a tournament
router.get('/:id/rounds', async (req, res) => {
  try {
    const tournament = await res.M.Tournament.findOne({ ownerId: req.user._id, _id: req.params.id });
    const players = tournament.playerSlots;
    const nbRounds = tournament.nbRounds;
    const result = await solver.solve(players, nbRounds);
    res.sendData(result);
  } catch (err) {
    res.sendException(err);
  }
});
const getTournamentGame = async function getTournamentGame(model,
  ownerId,
  tournamentId,
  tournamentRoundIndex,
  tournamentTableIndex) {
  return model.Game.findOne({ ownerId,
    tournamentId,
    tournamentRoundIndex,
    tournamentTableIndex,
  });
};
// Get a tournament game
router.get('/:id/round/:round/table/:table', async (req, res) => {
  try {
    const roundIndex = req.params.round;
    const tableIndex = req.params.table;
    let game = getTournamentGame(res.M, req.user._id, req.params.id, roundIndex, tableIndex);
    // Game found send it
    if (game === null) {
      // Game not found create it
      const tournament = await res.M.Tournament.findOne({ ownerId: req.user._id, _id: req.params.id });
      const playerSlots = [];
      const round = tournament.rounds[roundIndex];
      const table = round.tables[tableIndex];
      for (let index = 0; index < tournament.rules.NB_PLAYERS; index += 1) {
        const player = tournament.playerSlots[table.playerSlotIndexes[index]].player;
        playerSlots.push({ index, player });
      }
      const status = 'ongoing';
      const tournamentId = tournament._id;
      const rules = tournament.rules.name;
      game = res.M.Game({ rules, status, tournamentId, tournamentTableIndex, tournamentRoundIndex });
      game.ownerId = req.user._id;
      game = await game.save();
      return http.put('game');
    }
    const players = tournament.playerSlots;
    const nbRounds = tournament.nbRounds;
    const result = await solver.solve(players, nbRounds);
    res.sendData(game);
  } catch (err) {
    res.sendException(err);
  }
});

// Update tournament
router.post('/:id', async (req, res) => {
  try {
    let tournament = await res.M.Tournament.findOne({ ownerId: req.user._id, _id: req.params.id });
    Object.assign(tournament, req.body);
    tournament = await tournament.save();
    res.sendDataVersion(tournament);
  } catch (err) {
    res.sendException(err);
  }
});

// Get tournament
router.get('/:id', async (req, res) => {
  try {
    const tournament = await res.M.Tournament
      .findOne({ ownerId: req.user._id, _id: req.params.id })
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
