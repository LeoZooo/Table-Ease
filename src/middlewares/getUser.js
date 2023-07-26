const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const tokenService = require('../services/token.service');
const userService = require('../services/user.service');

const getUser = async (req, res, next) => {
  try {
    if (!req.query.token) {
      return next();
    }
    const verifyAccessToken = req.query.token;
    const userId = await tokenService.verifyAccessToken(verifyAccessToken);
    const user = await userService.getUserById(userId);
    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, `Invalid token:${error}`));
  }
};

module.exports = getUser;
