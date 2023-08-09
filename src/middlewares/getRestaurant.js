const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { getRest } = require('../services/restaurant.service');

const getRestaurant = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(httpStatus.BAD_REQUEST, "user doesn't exist");
    }
    const restaurant = await getRest(req.user);
    req.restaurant = restaurant;
    next();
  } catch (error) {
    return next(new ApiError(httpStatus.BAD_REQUEST), 'Faild to get restaurant');
  }
};

module.exports = getRestaurant;
