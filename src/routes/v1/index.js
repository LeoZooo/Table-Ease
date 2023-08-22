const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const restRoute = require('./restaurant.route');
const menuRoute = require('./menu.route');
const orderClientRoute = require('./orderClient.route');
const orderCustomerRoute = require('./provider/orderCustomer.route');
const { docsRoute, docsProviderRoute } = require('./docs.route');
const config = require('../../config/config');

const routesController = (router, routes) => {
  routes.forEach((route) => {
    router.use(route.path, route.route);
  });
};

const router = express.Router();
const providerRouter = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/rest',
    route: restRoute,
  },
  {
    path: '/menu',
    route: menuRoute,
  },
  {
    path: '/order',
    route: orderClientRoute,
  },
];
const providerRoutes = [
  {
    path: '/order',
    route: orderCustomerRoute,
  },
];

// routes available only in development mode
const devRoutes = [
  {
    path: '/docs',
    route: docsRoute,
  },
];
const devProviderRoutes = [
  {
    path: '/docs',
    route: docsProviderRoute,
  },
];

routesController(router, defaultRoutes);
routesController(providerRouter, providerRoutes);
/* istanbul ignore next */
if (config.env === 'development') {
  routesController(router, devRoutes);
  routesController(providerRouter, devProviderRoutes);
}

module.exports = { router, providerRouter };
