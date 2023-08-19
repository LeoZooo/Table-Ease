const httpStatus = require('http-status');
const { Restaurant, Order } = require('../models');
const verificationCode = require('../utils/verificaitonCode');
const ApiError = require('../utils/ApiError');

/**
 * Get restaurant by Name
 * @param {string} name
 * @returns {Promise<Restaurant>}
 */
const getRestaurantByName = async (name) => {
  return Restaurant.findOne({ name });
};

/**
 * Get restaurant by Id
 * @param {string} id
 * @returns {Promise<Restaurant>}
 */
const getRestaurantById = async (id) => {
  return Restaurant.findById(id);
};

/**
 * Get restaursant
 * @param {string} user
 * @returns {Promise<Restaurant>}
 */
const getRest = async (user) => {
  const restaurant = await getRestaurantById(user.restaurantId);
  if (!restaurant) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Use hasn't connected a restaurant or restaurant doesn't exist");
  }
  return restaurant;
};

/**
 * Register a restaurant
 * @param {string} user
 * @param {string} verficationCode
 * @param {string} restaurantToken
 * @param {string} name
 * @returns {Promise<Restaurant>}
 */
const registerRest = async (user, updateBody) => {
  const isRestTaken = await Restaurant.isRestTaken(updateBody.name);
  const verficationCode = await updateBody.verficationCode;
  if (verficationCode !== verificationCode()) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Code verification failed');
  }
  if (isRestTaken) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Restaurant name '${updateBody.name}' already taken`);
  }

  // Create restaurant and order database
  const savedRestaurant = await Restaurant.create(updateBody);
  const savedOrder = await Order.create({ restaurantId: savedRestaurant._id });

  Object.assign(user, { restaurantId: savedRestaurant._id });
  Object.assign(savedRestaurant, { orderId: savedOrder._id });
  await user.save();
  await savedRestaurant.save();
  return savedRestaurant;
};

/**
 * Connect a restaurant
 * @param {string} user
 * @param {string} restaurantToken
 * @param {string} name
 * @returns {Promise<Restaurant>}
 */
const connectRest = async (user, updateBody) => {
  const restaurant = await getRestaurantByName(updateBody.name);
  if (!restaurant || restaurant.restaurantToken !== updateBody.restaurantToken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect restaurant name or token');
  }
  Object.assign(user, { restaurantId: restaurant._id });
  await user.save();
  return restaurant;
};

/**
 * Disconnect a restaurant
 * @param {string} user
 */
const disconnectRest = async (user) => {
  if (!user.restaurantId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User hasn't connected a restaurant");
  }
  Object.assign(user, { restaurantId: null });
  await user.save();
};

/**
 * Manage a restaurant profile by user
 * @param {string} user
 * @param {string} restaurantToken
 * @param {string} discription
 * @param {string} headImg
 * @returns {Promise<Restaurant>}
 */
const updateRestProfile = async (user, updateBody) => {
  const restaurant = await getRestaurantById(user.restaurantId);
  if (!restaurant) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Use hasn't connected a restaurant or restaurant doesn't exist");
  }
  Object.assign(restaurant, updateBody);
  await restaurant.save();
  return restaurant;
};

/**
 * Manage a restaurant profile by admin
 * @param {string} pastName
 * @param {string} name
 * @param {string} restaurantToken
 * @param {string} discription
 * @param {string} headImg
 * @returns {Promise<Restaurant>}
 */
const updateRest = async (updateBody) => {
  const restaurant = await getRestaurantByName(updateBody.pastName);
  const isNameToken = await getRestaurantByName(updateBody.name);
  if (!restaurant) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Restaurant doesn't exist");
  }
  if (isNameToken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Restaurant name already exist');
  }
  Object.assign(restaurant, updateBody);
  await restaurant.save();
  return restaurant;
};

/**
 * Delete urestaurant
 * @param {String} name
 * @returns {Promise<Restaurant>}
 */
const deleteRest = async ({ name }) => {
  const restaurant = await getRestaurantByName(name);
  if (!restaurant) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Restaurant doesn't exist");
  }
  await restaurant.remove();
  return restaurant;
};

module.exports = {
  getRest,
  registerRest,
  connectRest,
  disconnectRest,
  updateRestProfile,
  updateRest,
  deleteRest,
};
