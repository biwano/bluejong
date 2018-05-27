const jwt = require('json-web-token');
const config = require('../config');
const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

// Get user information
router.get('/', async (req, res) => {
  const user = {
    type: req.user.type,
    name: req.user.name,
    roles: req.user.auth.roles,
  };
  res.sendData(user);
});
// Request registration
router.post('/request_registration', async (req, res) => {
  const email = req.body.email;
  // checking if email already used
  try {
    if (await res.M.User.findOne({ 'auth.login': email }) !== null) {
      res.sendError('error_email_taken');
    } else {
    // building token
      const payload = {
        userId: req.user._id,
        email,
      };
      const secret = config.token_secret;
      const token = await jwt.encode(secret, payload);
      // building link
      const link = `${config.client_url}/register/${token.value}`;
      // sending email
      await res.Mailer.sendTemplate('registration_link', email, { link }, 'en');
      res.sendSuccess();
    }
  } catch (e) {
    res.sendException(e);
  }
});
// Check token
router.get('/check_token/:token', async (req, res) => {
  try {
    const secret = config.token_secret;
    const token = req.params.token;
    const payload = await jwt.decode(secret, token);
    if (payload.error !== null) {
      res.sendError('error_token_invalid', payload.error);
    } else {
      res.sendData({ login: payload.value.email });
    }
  } catch (e) {
    res.sendException(e);
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const password = req.body.password;
    const token = req.body.token;
    const secret = config.token_secret;
    const saltRounds = 10;
    const payload = await jwt.decode(secret, token).value;
    // Checking if email already used
    if (await res.M.User.findOne({ 'auth.login': payload.email }) !== null) {
      res.sendError('error_email_taken');
    } else {
      // Generating password
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await res.M.User.findById(payload.userId);
      // Updating user information
      const email = payload.email;
      user.type = 'registered';
      user.name = email;
      user.email = email;
      user.auth = { login: email,
        password: hashedPassword,
        salt };
      req.session.user = await user.save();
      res.sendSuccess();
    }
  } catch (e) {
    res.sendException(e);
  }
});

// SignIn
router.post('/sign_in', async (req, res) => {
  try {
    const password = req.body.password;
    const login = req.body.email;
    // Getting user
    const user = await res.M.User.findOne({ 'auth.login': login });
    if (user === null) {
      res.sendResponse('error_auth_failed');
    } else {
      // Generating password
      console.log(user.auth.password);
      console.log(password);
      const result = await bcrypt.compare(password, user.auth.password);
      if (result) res.sendSuccess();
      else res.sendError('error_auth_failed');
    }
  } catch (e) {
    res.sendException(e);
  }
});

module.exports = router;
