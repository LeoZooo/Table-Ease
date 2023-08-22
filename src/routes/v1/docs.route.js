const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { swaggerDef, providerSwaggerDef } = require('../../docs/swaggerDef');

const docsRouterController = (swaggerDefinition, path) => {
  const router = express.Router();

  const specs = swaggerJsdoc({
    swaggerDefinition,
    apis: ['src/docs/*.yml', path],
  });

  router.use('/', swaggerUi.serve, (...args) =>
    swaggerUi.setup(specs, {
      explorer: true,
    })(...args)
  );

  return router;
};

const docsRoute = docsRouterController(swaggerDef, 'src/routes/v1/*.js');
const docsProviderRoute = docsRouterController(providerSwaggerDef, 'src/routes/v1/provider/*.route.js');

module.exports = { docsRoute, docsProviderRoute };
