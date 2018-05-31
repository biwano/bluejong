const express = require('express');
const bodyParser = require('body-parser');

const loggerMiddleware = require('./middlewares/loggerMiddleware.js');
const modelMiddleware = require('./middlewares/modelMiddleware.js');
const persistenceHelpers = require('./helpers/persistenceHelpers.js');
const authMiddleware = require('./middlewares/authMiddleware.js');
const mailMiddleware = require('./middlewares/mailMiddleware.js');
const responseMiddleware = require('./middlewares/responseMiddleware.js');

const adminRoute = require('./routes/adminRoute.js');
const playerRoute = require('./routes/playerRoute.js');
const gameRoute = require('./routes/gameRoute.js');
const authRoute = require('./routes/authRoute.js');
const tournamentRoute = require('./routes/tournamentRoute.js');


const app = express();

const connection = persistenceHelpers.connect();

connection.once('open', () => {
  app.use(bodyParser.json());
  app.use(loggerMiddleware);
  app.use(responseMiddleware);
  app.use(modelMiddleware);
  app.use(mailMiddleware);
  app.use(authMiddleware(connection));

  app.use('/api/admin', adminRoute);
  app.use('/api/auth', authRoute);
  app.use('/api/player', playerRoute);
  app.use('/api/game', gameRoute);
  app.use('/api/tournament', tournamentRoute);
});

app.listen(3000);
