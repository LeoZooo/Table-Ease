const moment = require('moment');
const config = require('../../src/config/config');
const { tokenTypes } = require('../../src/config/tokens');
const tokenService = require('../../src/services/token.service');
const { userOne, userThree } = require('./user.fixture');
const { user: userRest } = require('./restaurant.fixture');
const { user: userMenu } = require('./menuAndDishes.fixture');

const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
const userOneAccessToken = tokenService.generateToken(userOne._id, accessTokenExpires, tokenTypes.ACCESS);
const userThreeAccessToken = tokenService.generateToken(userThree._id, accessTokenExpires, tokenTypes.ACCESS);
const userRestAccessToken = tokenService.generateToken(userRest._id, accessTokenExpires, tokenTypes.ACCESS);
const userMenuAccessToken = tokenService.generateToken(userMenu._id, accessTokenExpires, tokenTypes.ACCESS);

module.exports = {
  userOneAccessToken,
  userThreeAccessToken,
  userRestAccessToken,
  userMenuAccessToken,
};
