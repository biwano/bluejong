const express = require('express');

const router = express.Router();

// Get user information
router.get('/', async (req, res) => {
  const user = {
    type: req.user.type,
    login: req.user.login,
    name: req.user.name,
  };
  res.json(user);
});

module.exports = router;
