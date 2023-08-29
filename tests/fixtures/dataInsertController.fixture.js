const User = require('../../src/models/user.model');
const Restaurant = require('../../src/models/restaurant.model');
const Menu = require('../../src/models/menu.model');
const Dishes = require('../../src/models/dishes.model');

const insertUser = async (user) => {
  await User.create(user);
};

const insertRestaurant = async (restaurant) => {
  await Restaurant.create(restaurant);
};

const insertMenu = async (menu) => {
  await Menu.create(menu);
};

const insertDishes = async (dishes) => {
  await Dishes.insertMany(dishes.map((dish) => ({ ...dish })));
};

module.exports = { insertUser, insertRestaurant, insertMenu, insertDishes };
