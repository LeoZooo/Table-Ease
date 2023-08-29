const mongoose = require('mongoose');
const faker = require('faker');

const userId = mongoose.Types.ObjectId();
const restaurantId = mongoose.Types.ObjectId();
const menuId = mongoose.Types.ObjectId();
const dishes1Id = mongoose.Types.ObjectId();
const dishes2Id = mongoose.Types.ObjectId();
const dishes3Id = mongoose.Types.ObjectId();
const dishes4Id = mongoose.Types.ObjectId();

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
  menuId,
};

const dishes1 = {
  _id: dishes1Id,
  menuId,
  name: 'Salmon Sashimi',
  price: 10.8,
  feature: true,
  category: 'sashimi',
  updateBy: mongoose.Types.ObjectId(),
};

const dishes2 = {
  _id: dishes2Id,
  menuId,
  name: 'Salmon Roll',
  description: 'Good taste and valuable',
  image: 'xxxxxxxx',
  price: 3.8,
  category: 'roll',
  updateBy: userId,
};

const dishes3 = {
  _id: dishes3Id,
  menuId,
  name: 'Tuna Sashimi',
  price: 12.8,
  updateBy: mongoose.Types.ObjectId(),
};

const dishes4 = {
  _id: dishes4Id,
  menuId,
  name: 'beef roll',
  price: 3.8,
  feature: true,
  category: 'roll',
  updateBy: mongoose.Types.ObjectId(),
};

const menu = {
  _id: menuId,
  restaurantId,
  dishes: [dishes1Id, dishes2Id, dishes3Id, dishes4Id],
  feature: [dishes1Id, dishes4Id],
  category: { roll: [dishes2Id, dishes4Id], sashimi: [dishes4Id], other: [dishes3Id] },
  updateBy: userId,
};

module.exports = { user, restaurant, menu, dishes1, dishes2, dishes3, dishes4 };
