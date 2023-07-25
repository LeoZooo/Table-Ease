const Joi = require('joi');

const getMenu = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const addDishes = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    image: Joi.string(),
    price: Joi.number().required(),
    feature: Joi.boolean6(),
    category: Joi.string(),
  }),
};

const deleteOrFindDishes = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const updateDishes = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      image: Joi.string(),
      price: Joi.number(),
      feature: Joi.string(),
      category: Joi.string(),
    })
    .min(1),
};

const sortFeature = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    feature: Joi.array().required(),
  }),
};

const sortCategory = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    category: Joi.object().required(),
  }),
};

module.exports = {
  getMenu,
  addDishes,
  deleteOrFindDishes,
  updateDishes,
  sortFeature,
  sortCategory,
};
