const mongoose = require('mongoose');
const faker = require('faker');

const userId = mongoose.Types.ObjectId();
const restaurantId = mongoose.Types.ObjectId();
const orderId = mongoose.Types.ObjectId();

const user = {
  _id: userId,
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password: 'password1',
  restaurantId,
};

const restaurant = {
  _id: restaurantId,
  restaurantToken: '123456',
  name: 'Japanese restaurant',
  table: 8,
  orderId,
};

const orderItem1 = {
  itemName: 'Salmon sashimi',
  itemPrice: 10.8,
  itemNumber: 1,
};

const orderItem2 = {
  itemName: 'Salmon roll',
  itemPrice: 3.8,
  itemNumber: 3,
};

const orderItem3 = {
  itemName: 'Beef roll',
  itemPrice: 3.6,
  itemNumber: 2,
  specialNote: 'no spicy',
};

const orderItem4 = {
  itemName: 'Tuna nigiri',
  itemPrice: 2.8,
  itemNumber: 10,
  specialNote: 'no raw',
};

const processingOrder1 = {
  orderTable: 6,
  orderItem: [orderItem1, orderItem3],
  totalPrice: 18,
  orderStartTime: '2023-08-19T12:34:56.789Z',
  orderUpdatedTime: '2023-08-19T12:38:56.789Z',
  guestNote: 'ASAP',
};

const processingOrder2 = {
  orderTable: 4,
  orderItem: [orderItem1],
  totalPrice: 11.4,
  orderStartTime: '2023-08-19T12:34:56.789Z',
};

const completedOrder1 = {
  orderTable: 6,
  orderItem: [orderItem2],
  totalPrice: 18,
  orderStartTime: '2023-08-19T12:34:56.789Z',
  orderCompletedTime: '2023-08-19T12:38:56.789Z',
  type: 'Success',
};

const completedOrder2 = {
  orderTable: 8,
  orderItem: [orderItem1, orderItem2, orderItem4],
  totalPrice: 40.2,
  orderStartTime: '2023-08-19T12:34:56.789Z',
  orderUpdatedTime: '2023-08-19T12:38:56.789Z',
  orderCompletedTime: '2023-08-19T12:38:56.789Z',
  type: 'Refund',
  managerNot: 'Customer reund this order',
};

const order = {
  _id: orderId,
  restaurantId,
  processingOrder: [processingOrder1, processingOrder2],
  completedOrder: [completedOrder1, completedOrder2],
};

module.exports = { user, restaurant, order, processingOrder1, completedOrder1 };
