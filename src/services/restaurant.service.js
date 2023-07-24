const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const { Restaurant } = require('../models');
const { tokenTypes } = require('../config/tokens');
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
  return Restaurant.findOne(id);
};

/**
 * Get user
 * @param {string} verifyAccessToken
 * @returns {Promise<User>}
 */
const getUser = async (verifyAccessToken) => {
  try {
    const verifyAccessTokenDoc = await tokenService.verifyToken(verifyAccessToken, tokenTypes.ACCESS);
    const user = await userService.getUserById(verifyAccessTokenDoc.user);
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'user procession failed');
    }
    return user;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, `${error} Access toekn verification failed`);
  }
};

/**
 * Register a restaurant
 * @param {string} accessToken
 * @param {string} verficationCode
 * @param {string} restaurantToken
 * @param {string} name
 * @returns {Promise<Restaurant>}
 */
const registerRest = async (verifyAccessToken, restaurantBody) => {
  const user = await getUser(verifyAccessToken);
  const isRestTaken = await Restaurant.isRestTaken(restaurantBody.name);
  const verficationCode = await restaurantBody.verficationCode;
  if (isRestTaken) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Restaurant name '${restaurantBody.name}' already taken`);
  }
  if (verficationCode !== verificationCode()) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Code verification failed');
  }
  const savedRestaurant = await Restaurant.create(restaurantBody);
  Object.assign(user, { restaurantId: savedRestaurant._id });
  await user.save();
  return savedRestaurant;
};

/**
 * Connect a restaurant
 * @param {string} accessToken
 * @param {string} restaurantToken
 * @param {string} name
 * @returns {Promise<Restaurant>}
 */
const connectRest = async (verifyAccessToken, restaurantBody) => {
  const user = await getUser(verifyAccessToken);
  const restaurant = await getRestaurantByName(restaurantBody.name);
  if (!restaurant || restaurant.restaurantToken !== restaurantBody.restaurantToken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect restaurant name or token');
  }
  Object.assign(user, { restaurantId: restaurant._id });
  await user.save();
  return restaurant;
};

/**
 * Disconnect a restaurant
 * @param {string} accessToken
 */
const disconnectRest = async (verifyAccessToken) => {
  const user = await getUser(verifyAccessToken);
  if (!user.restaurantId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User hasn't connected a restaurant");
  }
  Object.assign(user, { restaurantId: null });
  await user.save();
};

/**
 * Manage a restaurant profile by user
 * @param {string} accessToken
 * @param {string} restaurantToken
 * @param {string} discription
 * @param {string} headImg
 * @returns {Promise<Restaurant>}
 */
const updateRestProfile = async (verifyAccessToken, restaurantBody) => {
  const user = await getUser(verifyAccessToken);
  const restaurant = await getRestaurantById(user.restaurantId);
  if (!restaurant) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Restaurant doesn't exist");
  }
  Object.assign(restaurant, restaurantBody);
  await restaurant.save();
  return restaurant;
};

/**
 * Manage a restaurant profile by admin
 * @param {string} oldName
 * @param {string} name
 * @param {string} restaurantToken
 * @param {string} discription
 * @param {string} headImg
 * @returns {Promise<Restaurant>}
 */
const updateRest = async (restaurantBody) => {
  const restaurant = await getRestaurantByName(restaurantBody.oldName);
  if (!restaurant) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Restaurant doesn't exist");
  }
  Object.assign(restaurant, restaurantBody);
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
  registerRest,
  connectRest,
  disconnectRest,
  updateRestProfile,
  updateRest,
  deleteRest,
};
