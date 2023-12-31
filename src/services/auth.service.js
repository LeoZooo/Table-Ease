const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Get user
 * @param {string} verifyAccessToken
 * @returns {Promise<User>}
 */
const getUser = async (verifyAccessToken) => {
  try {
    const userId = await tokenService.verifyAccessToken(verifyAccessToken);
    const user = await userService.getUserById(userId);
    return user;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, `Invalid token:${error}`);
  }
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'user procession failed');
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'user procession failed');
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'user procession failed');
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, `${error} Email verification failed`);
  }
};

/**
 * Update profile
 * @param {string} accessToken
 * @param {string} gender
 * @param {string} role
 * @returns {Promise<User>}
 */
const updateProfile = async (verifyAccessToken, updateBody) => {
  try {
    await tokenService.verifyAccessToken(verifyAccessToken);

    if (!updateBody || !updateBody.email) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'The request is missing a valid request body or email address');
    }
    const user = await userService.getUserByEmail(updateBody.email);
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, "email doesn't match or user doesn't exist");
    }
    const updatedUser = await userService.updateUserById(user._id, updateBody);
    return updatedUser;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, `${error}`);
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  getUser,
  refreshAuth,
  resetPassword,
  verifyEmail,
  updateProfile,
};
