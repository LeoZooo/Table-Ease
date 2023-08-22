const mongoose = require('mongoose');

const { app, providerApp } = require('./app');
const { connectQueueClient } = require('./utils/rabbitMQ');
const config = require('./config/config');
const logger = require('./config/logger');
const generateVerificationCode = require('./utils/verificaitonCode');

const serverController = (port, App) => {
  let server;
  mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
    logger.info('Connected to MongoDB');
    server = App.listen(port, () => {
      logger.info(`Listening to port ${port}`);
    });
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info('Server closed');
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
      server.close();
    }
  });
};

serverController(config.port, app);
serverController(config.providerPort, providerApp);

generateVerificationCode();
connectQueueClient();
