const mongoose = require('mongoose');
const faker = require('faker');

const restaurantId = mongoose.Types.ObjectId();
const user = {
  _id: mongoose.Types.ObjectId(),
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
};

module.exports = { user, restaurant };
