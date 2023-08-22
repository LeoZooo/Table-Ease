const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Sagger API documentation',
    version,
    license: {
      name: 'MIT',
      url: 'https://github.com/hagopj13/node-express-boilerplate/blob/master/LICENSE',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
    },
  ],
};

const providerSwaggerDef = {
  ...swaggerDef,
  servers: [
    {
      url: `http://localhost:${config.providerPort}/v1`,
    },
  ],
};

module.exports = { swaggerDef, providerSwaggerDef };
