const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const orderItem = [
  {
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
  },
];

const processingOrder = mongoose.Schema({
  orderTable: {
    type: Number,
    required: true,
  },
  orderItem,
  totalPrice: {
    type: Number,
    required: true,
  },
  orderStartTime: {
    type: Date,
    required: true,
  },
  orderUpdatedTime: {
    type: Date,
  },
  guestNote: {
    type: String,
  },
});

const completedOrder = mongoose.Schema({
  orderTable: {
    type: Number,
    required: true,
  },
  orderItem,
  totalPrice: {
    type: Number,
    required: true,
  },
  orderStartTime: {
    type: Date,
    required: true,
  },
  orderUpdatedTime: {
    type: Date,
  },
  orderCompletedTime: {
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
    processingOrder: {
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
processingOrder.plugin(toJSON);
processingOrder.plugin(paginate);
completedOrder.plugin(toJSON);
completedOrder.plugin(paginate);
orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

/**
 * @typedef Order
 */
const ProcessingOrder = mongoose.model('ProcessingOrder', processingOrder);
const CompletedOrder = mongoose.model('CompletedOrder ', completedOrder);
const Order = mongoose.model('Order', orderSchema);

module.exports = { ProcessingOrder, CompletedOrder, Order };
