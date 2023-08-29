const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { MUST_CONTAIN_NUMBER } = require('../utils/constantRegx');

const restaurantSchema = mongoose.Schema(
  {
    restaurantToken: {
      type: String,
      required: true,
      length: 6,
      validate(value) {
        if (!value.match(MUST_CONTAIN_NUMBER) || value.length !== 6) {
          throw new Error('token must be a six-digit number');
        }
      },
    },
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    table: {
      type: Number,
      required: true,
      validate(value) {
        if (value <= 0) {
          throw new Error('Table number must be more than 0');
        }
      },
    },
    description: {
      type: String,
    },
    headImg: {
      type: String,
    },
    menuId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu',
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
restaurantSchema.plugin(toJSON);
restaurantSchema.plugin(paginate);

/**
 * Check if restaurant name is taken
 * @param {string} name- The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
restaurantSchema.statics.isRestTaken = async function (name, excludeUserId) {
  const restaurant = await this.findOne({ name, _id: { $ne: excludeUserId } });
  return !!restaurant;
};

/**
 * @typedef Restaurant
 */
const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
