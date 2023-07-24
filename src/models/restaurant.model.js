const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const restaurantSchema = mongoose.Schema(
  {
    restaurantToken: {
      type: String,
      required: true,
      length: 6,
      validate(value) {
        if (!value.match(/^[0-9]+$/)) {
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
    description: {
      type: String,
    },
    headImg: {
      type: String,
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
