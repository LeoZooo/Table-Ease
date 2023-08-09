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
    verficationCode: Joi.string().required().custom(restaurantToken),
    restaurantToken: Joi.string().required().custom(restaurantToken),
    name: Joi.string().required(),
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
      discription: Joi.string(),
      headImg: Joi.string(),
    })
    .min(1),
};

const updateRest = {
  body: Joi.object()
    .keys({
      oldName: Joi.string(),
      name: Joi.string(),
      restaurantToken: Joi.string().custom(restaurantToken),
      discription: Joi.string(),
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
