const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const dishesSchema = mongoose.Schema(
  {
    menuId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu',
      required: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
      validate(value) {
        if (!value < 0) {
          throw new Error('Price is no less than 0');
        }
      },
    },
    feature: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      default: 'other',
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

dishesSchema.index({ menuId: 1, name: 1 }, { unique: true });

// add plugin that converts mongoose to json
dishesSchema.plugin(toJSON);
dishesSchema.plugin(paginate);

/**
 * @typedef Dishes
 */
const Dishes = mongoose.model('Dishes', dishesSchema);

module.exports = Dishes;
