const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const orderItem = mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  itemPrice: {
    type: Number,
    required: true,
  },
  itemNumber: {
    type: Number,
    required: true,
  },
  specialNote: {
    type: String,
  },
});

const processingOrder = mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  orderTable: {
    type: Number,
    required: true,
  },
  orderItem: {
    type: [orderItem],
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  orderStartTime: {
    type: Date,
    required: true,
  },
  lastModifyTime: {
    type: Date,
  },
  guestNote: {
    type: String,
  },
});

const completedOrder = mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  orderTable: {
    type: Number,
    required: true,
  },
  orderItem: {
    type: [orderItem],
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  orderStartTime: {
    type: Date,
    required: true,
  },
  lastModifyTime: {
    type: Date,
  },
  ordercompletedTime: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ['Success', 'Cancel', 'Refund', 'Partial Success'],
    required: true,
  },
  guestNote: {
    type: String,
  },
  managerNote: {
    type: String,
  },
});

const orderSchema = mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    precessingOrder: {
      type: [processingOrder],
    },
    completedOrder: {
      type: [completedOrder],
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

/**
 * @typedef Order
 */
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
