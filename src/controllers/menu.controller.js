const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { menu } = require('../services');

const addDishes = catchAsync(async (req, res) => {
  const dishes = await menu.addDishes(req.user._id, req.restaurant, req.body);
  res.staus(httpStatus.CREATED).send(dishes);
});

const findDishes = catchAsync(async (req, res) => {
  const dishes = await menu.findDishes(req.menu, req.body);
  res.send(dishes);
});

const deleteDishes = catchAsync(async (req, res) => {
  await menu.deleteDishes(req.user._id, req.menu, req.body);
  res.status(httpStatus.NO_CONTENT).send();
});

const updateDishes = catchAsync(async (req, res) => {
  const dishes = await menu.updateDishes(req.user._id, req.menu, req.body);
  res.send(dishes);
});

const sortFeature = catchAsync(async (req, res) => {
  const newMenu = await menu.sortFeature(req.user._id, req.menu, req.body);
  res.send(newMenu);
});

const sortCategory = catchAsync(async (req, res) => {
  const newMenu = await menu.sortCategory(req.user._id, req.menu, req.body);
  res.send(newMenu);
});

module.exports = {
  addDishes,
  findDishes,
  deleteDishes,
  updateDishes,
  sortFeature,
  sortCategory,
};
