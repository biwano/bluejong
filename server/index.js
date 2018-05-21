const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config.js');
const persistence = require('./middlewares/persistence.js');
const auth = require('./middlewares/auth.js');
const helpers = require('./middlewares/helpers.js');
const admin = require('./routes/adminRoute.js');
const player = require('./routes/playerRoute.js');
const game = require('./routes/gameRoute.js');

const app = express();

const connection = persistence.connect(config.persistence.url);

connection.once('open', () => {
  app.use(helpers);
  app.use(bodyParser.json());
  app.use(persistence.router);
  app.use(auth(connection));

  app.use('/api/admin', admin);
  app.use('/api/player', player);
  app.use('/api/game', game);
});

app.listen(3000);
