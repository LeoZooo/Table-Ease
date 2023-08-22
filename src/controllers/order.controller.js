const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { orderService } = require('../services');

const viewOrderByCustomer = catchAsync(async (req, res) => {
  const order = await orderService.viewOrderByCustomer(req.body);
  res.send(order);
});

const uploadOrderByCustomer = catchAsync(async (req, res) => {
  await orderService.uploadOrderByCustomer(req.body);
  res.status(httpStatus.CREATED).send();
});

const getProcessingOrder = catchAsync(async (req, res) => {
  const order = await orderService.getProcessingOrder(req.restaurant);
  res.send(order);
});

const getCompletedOrder = catchAsync(async (req, res) => {
  const order = await orderService.getCompletedOrder(req.restaurant);
  res.send(order);
});

const transitionOrderToCompleted = catchAsync(async (req, res) => {
  const order = await orderService.transitionOrderToCompleted(req.restaurant, req.body);
  res.send(order);
});

module.exports = {
  viewOrderByCustomer,
  uploadOrderByCustomer,
  getProcessingOrder,
  getCompletedOrder,
  transitionOrderToCompleted,
};
