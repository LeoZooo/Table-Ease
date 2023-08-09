const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { dishesSchema } = require('./dishes.model');

const menuSchema = mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    dishes: {
      type: [dishesSchema],
    },
    feature: {
      type: [dishesSchema],
    },
    category: {
      type: Object,
    },
    updateBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
menuSchema.plugin(toJSON);
menuSchema.plugin(paginate);

/**
 * @typedef Menu
 */
const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
