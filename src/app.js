const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');

const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const { router, providerRouter } = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');

const middlewaresController = (app, route) => {
  if (config.env !== 'test') {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
  }

  app.use(helmet());

  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));

  app.use(xss());
  app.use(mongoSanitize());

  app.use(compression());

  app.use(cors());
  app.options('*', cors());

  app.use(passport.initialize());
  passport.use('jwt', jwtStrategy);

  app.use('/v1', route);

  app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
  });

  app.use(errorConverter);

  app.use(errorHandler);
};

const app = express();
const providerApp = express();

if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

middlewaresController(app, router);
middlewaresController(providerApp, providerRouter);

module.exports = { app, providerApp };
