const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Menu } = require('../models');

const getMenu = async (req, res, next) => {
  try {
    if (!req.restaurant) {
      throw new ApiError(httpStatus.BAD_REQUEST, "restaurant doesn't exist");
    }
    const { restaurant } = req;
    if (restaurant.menuId) {
      const menu = await Menu.findById(restaurant.menuId);
      req.menu = menu;
    }
    next();
  } catch (error) {
    return next(new ApiError(httpStatus.BAD_REQUEST), 'Faild to get menu');
  }
};

module.exports = getMenu;
