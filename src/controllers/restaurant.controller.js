const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { restaurantService } = require('../services');

const getRest = catchAsync(async (req, res) => {
  const restaurant = await restaurantService.getRest(req.user);
  res.send(restaurant);
});

const registerRest = catchAsync(async (req, res) => {
  const restaurant = await restaurantService.registerRest(req.user, req.body);
  res.status(httpStatus.CREATED).send(restaurant);
});

const connectRest = catchAsync(async (req, res) => {
  const restaurant = await restaurantService.connectRest(req.user, req.body);
  res.send(restaurant);
});

const disconnectRest = catchAsync(async (req, res) => {
  await restaurantService.disconnectRest(req.user);
  res.status(httpStatus.NO_CONTENT).send();
});

const updateRestProfile = catchAsync(async (req, res) => {
  const restaurant = await restaurantService.updateRestProfile(req.user, req.body);
  res.send(restaurant);
});

const updateRest = catchAsync(async (req, res) => {
  const restaurant = await restaurantService.updateRest(req.body);
  res.send(restaurant);
});

const deleteRest = catchAsync(async (req, res) => {
  await restaurantService.deleteRest(req.body);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getRest,
  registerRest,
  connectRest,
  disconnectRest,
  updateRestProfile,
  updateRest,
  deleteRest,
};
