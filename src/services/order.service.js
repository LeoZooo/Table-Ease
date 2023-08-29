const httpStatus = require('http-status');

const { Orders } = require('../models');

const { ProcessingOrder, CompletedOrder, Order } = Orders;
const { connectQueueCustomer } = require('../utils/rabbitMQ');

const ApiError = require('../utils/ApiError');

/**
 * Get order
 * @param {string} orderId
 * @returns {Promise<Order>}
 */
const getOrder = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Orders ID '${orderId}' doesn't have order list`);
  }
  return order;
};

/**
 * View order by customer
 * @param {string} orderId
 * @param {number} orderTable
 * @returns {Promise<ProcessingOrder>}
 */
const viewOrderByCustomer = async (updateBody) => {
  const { orderId, orderTable } = updateBody;
  const order = await getOrder(orderId);

  const savedOrder = order.processingOrder.find((each) => each.orderTable === orderTable);
  if (!savedOrder) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Order ID '${orderId}' doesn't have order on table ${orderTable}`);
  }
  return { order: savedOrder };
};

/**
 * Upload order by customer
 * @param {string} orderId
 * @param {number} orderTable
 * @param {array} orderItem
 * @param {number} totalPrice
 * @param {date} time
 * @param {string} guestNote
 */
const uploadOrderByCustomer = async (updateBody) => {
  const { orderId, orderTable, time } = updateBody;
  const order = await getOrder(orderId);

  let savedOrder = order.processingOrder.find((each) => each.orderTable === orderTable);

  // If order already exist
  if (savedOrder) {
    const orderUpdatedTime = time;
    Object.assign(savedOrder, { orderUpdatedTime, ...updateBody });
    await order.save();
    connectQueueCustomer(`You have an updated order at TABLE ${orderTable}.`);
  } else {
    const orderStartTime = time;
    savedOrder = await ProcessingOrder.create({ ...updateBody, orderStartTime });

    order.processingOrder.push(savedOrder);
    await order.save();
    connectQueueCustomer(`You have an new order at TABLE ${orderTable}.`);
  }
};

/**
 * Get processing order
 * @param {string} restaurant
 * @returns {Promise<ProcessingOrder>}
 */
const getProcessingOrder = async (restaurant) => {
  const { orderId } = restaurant;
  const order = await getOrder(orderId);
  const { processingOrder } = order;
  if (!processingOrder) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Order '${orderId}' doesn't have processing order`);
  }
  return { processingOrder };
};

/**
 * Get completed order
 * @param {string} restaurant
 * @returns {Promise<CompletedOrder>}
 */
const getCompletedOrder = async (restaurant) => {
  const { orderId } = restaurant;
  const order = await getOrder(orderId);
  const { completedOrder } = order;
  if (!completedOrder) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Order '${orderId}' doesn't have processing order`);
  }
  return { completedOrder };
};

/**
 * Transition processing order to complete
 * @param {string} restaurant
 * @param {number} orderTable
 * @param {date} ordercompletedTime
 * @param {string} type
 * @param {string} managerNoteq
 * @returns {Promise<CompletedOrder>}
 */
const transitionOrderToCompleted = async (restaurant, updateBody) => {
  const { orderId } = restaurant;
  const { orderTable } = updateBody;
  const order = await getOrder(orderId);
  const savedOrder = order.processingOrder.find((each) => each.orderTable === orderTable);
  if (!savedOrder) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Table ${orderTable} doesn't have an order`);
  }

  const savedData = savedOrder.toObject();
  const completedOrder = await CompletedOrder.create({ ...savedData, ...updateBody });
  order.completedOrder.push(completedOrder);

  order.processingOrder = order.processingOrder.find((each) => each.orderTable !== orderTable);
  await order.save();
  await ProcessingOrder.findById(savedOrder._id).deleteOne();

  return { order: completedOrder };
};

module.exports = {
  viewOrderByCustomer,
  uploadOrderByCustomer,
  getProcessingOrder,
  getCompletedOrder,
  transitionOrderToCompleted,
};
