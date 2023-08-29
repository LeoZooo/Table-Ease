const Joi = require('joi');
const { restaurantToken } = require('./custom.validation');

const getRest = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const registerRest = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    verificationCode: Joi.string().required().custom(restaurantToken),
    restaurantToken: Joi.string().required().custom(restaurantToken),
    name: Joi.string().required(),
    table: Joi.number().required(),
  }),
};

const connectRest = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    restaurantToken: Joi.string().required().custom(restaurantToken),
    name: Joi.string().required(),
  }),
};

const disconnectRest = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const updateRestProfile = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      restaurantToken: Joi.string().custom(restaurantToken),
      table: Joi.number().required(),
      description: Joi.string(),
      headImg: Joi.string(),
    })
    .min(1),
};

const updateRest = {
  body: Joi.object()
    .keys({
      pastName: Joi.string(),
      name: Joi.string(),
      table: Joi.number().required(),
      restaurantToken: Joi.string().custom(restaurantToken),
      description: Joi.string(),
      headImg: Joi.string(),
    })
    .min(1),
};

const deleteRest = {
  body: Joi.object().keys({
    name: Joi.string(),
  }),
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
