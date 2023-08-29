const mongoose = require('mongoose');
const { Orders } = require('../../../src/models');

const { ProcessingOrder, CompletedOrder, Order } = Orders;

describe('Orders model validation', () => {
  const orderItem1 = {
    itemName: 'Beef Roll',
    itemPrice: 3.8,
    itemNumber: 3,
    specialNote: 'no spicy',
  };
  const orderItem2 = {
    itemName: 'Slamon Sashimi',
    itemPrice: 10.8,
    itemNumber: 1,
  };
  let processingOrder;
  let completedOrder;
  let order;
  beforeEach(() => {
    processingOrder = {
      orderTable: 12,
      orderItem: [orderItem1, orderItem2],
      totalPrice: 23.2,
      orderStartTime: '2023-08-19T12:34:56.789Z',
    };
    completedOrder = {
      orderTable: 8,
      orderItem: [orderItem1, orderItem2],
      totalPrice: 23.2,
      orderStartTime: '2023-08-19T12:34:56.789Z',
      orderCompletedTime: '2023-08-20T12:34:56.789Z',
      type: 'Success',
    };
    order = {
      restaurantId: mongoose.Types.ObjectId(),
    };
  });

  describe('Order model validation', () => {
    test('should correctly validate a valid order', async () => {
      await expect(new Order(order).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if order no restaurantId', async () => {
      order.restaurantId = '';
      await expect(new Order(order).validate()).rejects.toThrow();
    });
  });

  describe('Processing order model validation', () => {
    test('should correctly validate a valid processing order', async () => {
      await expect(new ProcessingOrder(processingOrder).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if processing order no orderTable', async () => {
      processingOrder.orderTable = '';
      await expect(new ProcessingOrder(processingOrder).validate()).rejects.toThrow();
    });

    test('should throw a validation error if processing order no orderItem', async () => {
      processingOrder.orderItem = '';
      await expect(new ProcessingOrder(processingOrder).validate()).rejects.toThrow();
    });

    test('should throw a validation error if processing order no totalPrice', async () => {
      processingOrder.totalPrice = '';
      await expect(new ProcessingOrder(processingOrder).validate()).rejects.toThrow();
    });

    test('should throw a validation error if processing order no orderStartTime', async () => {
      processingOrder.totalPrice = '';
      await expect(new ProcessingOrder(processingOrder).validate()).rejects.toThrow();
    });
  });

  describe('Completed order model validation', () => {
    test('should correctly validate a valid completed order', async () => {
      await expect(new CompletedOrder(completedOrder).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if completed order no orderCompletedTime', async () => {
      completedOrder.orderCompletedTime = '';
      await expect(new CompletedOrder(completedOrder).validate()).rejects.toThrow();
    });

    test('should throw a validation error if completed order type is invaild', async () => {
      completedOrder.type = 'pending';
      await expect(new CompletedOrder(completedOrder).validate()).rejects.toThrow();
    });
  });
});
