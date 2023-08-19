const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { menuService } = require('../services');

const getDishes = catchAsync(async (req, res) => {
  const dishes = await menuService.getDishes(req.menu);
  res.send(dishes);
});

const getFeature = catchAsync(async (req, res) => {
  const feature = await menuService.getFeature(req.menu);
  res.send(feature);
});

const getCategory = catchAsync(async (req, res) => {
  const category = await menuService.getCategory(req.menu);
  res.send(category);
});

const addDishes = catchAsync(async (req, res) => {
  const dishes = await menuService.addDishes(req.user._id, req.restaurant, req.body);
  res.status(httpStatus.CREATED).send(dishes);
});

const findDishes = catchAsync(async (req, res) => {
  const dishes = await menuService.findDishes(req.menu, req.body);
  res.send(dishes);
});

const deleteDishes = catchAsync(async (req, res) => {
  await menuService.deleteDishes(req.user._id, req.menu, req.body);
  res.status(httpStatus.NO_CONTENT).send();
});

const updateDishes = catchAsync(async (req, res) => {
  const dishes = await menuService.updateDishes(req.user._id, req.menu, req.body);
  res.send(dishes);
});

const sortFeature = catchAsync(async (req, res) => {
  const newMenu = await menuService.sortFeature(req.user._id, req.menu, req.body);
  res.send(newMenu);
});

const sortCategory = catchAsync(async (req, res) => {
  const newMenu = await menuService.sortCategory(req.user._id, req.menu, req.body);
  res.send(newMenu);
});

module.exports = {
  getDishes,
  getFeature,
  getCategory,
  addDishes,
  findDishes,
  deleteDishes,
  updateDishes,
  sortFeature,
  sortCategory,
};
