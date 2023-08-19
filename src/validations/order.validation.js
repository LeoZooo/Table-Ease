const Joi = require('joi');
const { orderItem } = require('./custom.validation');

const viewOrderByCustomer = {
  body: Joi.object().keys({
    orderTable: Joi.number().required(),
  }),
};

const uploadOrderByCustomer = {
  body: Joi.object().keys({
    orderTable: Joi.number().required(),
    orderItem: Joi.array().custom(orderItem),
    totalPrice: Joi.number(),
    orderStartTime: Joi.date(),
    lastModifyTime: Joi.date(),
    guestNote: Joi.string(),
  }),
};

const getProcessingOrder = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const getCompletedOrder = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const transitionOrderToCompleted = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    orderTable: Joi.number().required(),
    ordercompletedTime: Joi.date().required(),
    type: Joi.string().required(),
    managerNote: Joi.string(),
  }),
};

module.exports = {
  viewOrderByCustomer,
  uploadOrderByCustomer,
  getProcessingOrder,
  getCompletedOrder,
  transitionOrderToCompleted,
};
