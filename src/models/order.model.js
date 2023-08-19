const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const orderSchema = mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    precessingOrder: {
      type: Array,
      default: [],
    },
    finishedOrder: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);
