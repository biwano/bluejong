const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config.js');
const persistence = require('./middlewares/persistence.js');
const auth = require('./middlewares/auth.js');
const helpers = require('./middlewares/helpers.js');
const adminRoute = require('./routes/adminRoute.js');
const playerRoute = require('./routes/playerRoute.js');
const gameRoute = require('./routes/gameRoute.js');
const authRoute = require('./routes/authRoute.js');

const app = express();

const connection = persistence.connect(config.persistence.url);

connection.once('open', () => {
  app.use(helpers);
  app.use(bodyParser.json());
  app.use(persistence.router);
  app.use(auth(connection));

  app.use('/api/admin', adminRoute);
  app.use('/api/player', playerRoute);
  app.use('/api/game', gameRoute);
  app.use('/api/auth', authRoute);
});

app.listen(3000);
