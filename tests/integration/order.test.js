const request = require('supertest');
const httpStatus = require('http-status');
const { app, providerApp } = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const getUser = require('../../src/middlewares/getUser');
const getRestaurant = require('../../src/middlewares/getRestaurant');
const { Orders } = require('../../src/models');

const { user, restaurant, order, processingOrder1, completedOrder1 } = require('../fixtures/order.fixture');
const { userOrderAccessToken } = require('../fixtures/token.fixture');
const { insertUser, insertRestaurant, insertOrder } = require('../fixtures/dataInsertController.fixture');

setupTestDB();
app.use(getUser);
app.use(getRestaurant);
const { ProcessingOrder, CompletedOrder } = Orders;

describe('Order routes', () => {
  describe('GET /v1/order/get-processing-order', () => {
    test('should return 200 and successfully get the order data', async () => {
      await insertUser(user);
      await insertRestaurant(restaurant);
      await insertOrder(order);

      const res = await request(app)
        .get('/v1/order/get-processing-order')
        .query({ token: userOrderAccessToken })
        .send()
        .expect(httpStatus.OK);

      expect(res.body.processingOrder[0]).toEqual({
        id: expect.anything(),
        orderTable: processingOrder1.orderTable,
        orderItem: expect.anything(),
        totalPrice: processingOrder1.totalPrice,
        orderStartTime: processingOrder1.orderStartTime,
        orderUpdatedTime: processingOrder1.orderUpdatedTime,
        guestNote: processingOrder1.guestNote,
      });
      expect(res.body.processingOrder[0].orderItem[0]).toMatchObject({
        itemName: 'Salmon sashimi',
        itemPrice: 10.8,
        itemNumber: 1,
      });
    });

    test(`should return 200 and successfully get the order data if doesn't have processing order`, async () => {
      await insertUser(user);
      await insertRestaurant(restaurant);
      const tmpProcessingOrder = order.processingOrder;
      order.processingOrder = [];
      await insertOrder(order);

      const res = await request(app)
        .get('/v1/order/get-processing-order')
        .query({ token: userOrderAccessToken })
        .send()
        .expect(httpStatus.OK);

      expect(res.body.processingOrder).toEqual([]);

      order.processingOrder = tmpProcessingOrder;
    });

    test(`should return 400 if restaurnt doesn't have order data`, async () => {
      await insertUser(user);
      delete restaurant.orderId;
      await insertRestaurant(restaurant);

      await request(app)
        .get('/v1/order/get-processing-order')
        .query({ token: userOrderAccessToken })
        .send()
        .expect(httpStatus.BAD_REQUEST);

      restaurant.orderId = order._id;
    });
  });

  describe('GET /v1/order/get-completed-order', () => {
    test('should return 200 and successfully get the order data', async () => {
      await insertUser(user);
      await insertRestaurant(restaurant);
      await insertOrder(order);

      const res = await request(app)
        .get('/v1/order/get-completed-order')
        .query({ token: userOrderAccessToken })
        .send()
        .expect(httpStatus.OK);

      expect(res.body.completedOrder[0]).toEqual({
        id: expect.anything(),
        orderTable: completedOrder1.orderTable,
        orderItem: expect.anything(),
        totalPrice: completedOrder1.totalPrice,
        orderStartTime: completedOrder1.orderStartTime,
        orderCompletedTime: completedOrder1.orderCompletedTime,
        type: completedOrder1.type,
      });
      expect(res.body.completedOrder[0].orderItem[0]).toMatchObject({
        itemName: 'Salmon roll',
        itemPrice: 3.8,
        itemNumber: 3,
      });
    });

    test(`should return 200 and successfully get the order data if doesn't have processing order`, async () => {
      await insertUser(user);
      await insertRestaurant(restaurant);
      const tmpCompletedOrder = order.completedOrder;
      order.completedOrder = [];
      await insertOrder(order);

      const res = await request(app)
        .get('/v1/order/get-completed-order')
        .query({ token: userOrderAccessToken })
        .send()
        .expect(httpStatus.OK);

      expect(res.body.completedOrder).toEqual([]);

      order.completedOrder = tmpCompletedOrder;
    });
  });

  describe('POST /v1/order/order-transition', () => {
    let orderData;
    beforeEach(() => {
      orderData = {
        orderTable: 6,
        orderCompletedTime: '2023-08-19T12:34:56.789Z',
        type: 'Cancel',
        managerNote: 'Custumer cancel this order.',
      };
    });

    test('should return 201 and successfully transit the order data', async () => {
      await insertUser(user);
      await insertRestaurant(restaurant);
      await insertOrder(order);

      const res = await request(app)
        .post('/v1/order/order-transition')
        .query({ token: userOrderAccessToken })
        .send(orderData)
        .expect(httpStatus.CREATED);

      expect(res.body.order).toEqual({
        id: expect.anything(),
        orderTable: processingOrder1.orderTable,
        orderItem: expect.anything(),
        totalPrice: processingOrder1.totalPrice,
        orderStartTime: processingOrder1.orderStartTime,
        orderUpdatedTime: processingOrder1.orderUpdatedTime,
        orderCompletedTime: orderData.orderCompletedTime,
        type: orderData.type,
        guestNote: processingOrder1.guestNote,
        managerNote: orderData.managerNote,
      });

      let dbOrder = await CompletedOrder.findById(res.body.order.id);
      expect(dbOrder).toBeDefined();

      dbOrder = await ProcessingOrder.findById(processingOrder1._id);
      expect(dbOrder).toBeNull();
    });

    test(`should return 400 if doesn't exist an order in this table`, async () => {
      orderData.orderTable = 3;
      await insertUser(user);
      await insertRestaurant(restaurant);
      await insertOrder(order);

      await request(app)
        .post('/v1/order/order-transition')
        .query({ token: userOrderAccessToken })
        .send(orderData)
        .expect(httpStatus.BAD_REQUEST);
    });

    test(`should return 400 if order doesn't have completed time`, async () => {
      delete orderData.orderCompletedTime;
      await insertUser(user);
      await insertRestaurant(restaurant);
      await insertOrder(order);

      await request(app)
        .post('/v1/order/order-transition')
        .query({ token: userOrderAccessToken })
        .send(orderData)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if order have a wrong type', async () => {
      orderData.type = 'Pending';
      await insertUser(user);
      await insertRestaurant(restaurant);
      await insertOrder(order);

      await request(app)
        .post('/v1/order/order-transition')
        .query({ token: userOrderAccessToken })
        .send(orderData)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('POST /v1/order/view-order', () => {
    let orderData;
    beforeEach(() => {
      orderData = {
        orderTable: 6,
        orderId: order._id,
      };
    });

    test('should return 200 and successfully get the order data', async () => {
      await insertOrder(order);

      const res = await request(providerApp).post('/v1/order/view-order').send(orderData).expect(httpStatus.OK);

      expect(res.body.order).toEqual({
        id: expect.anything(),
        orderTable: processingOrder1.orderTable,
        orderItem: expect.anything(),
        totalPrice: processingOrder1.totalPrice,
        orderStartTime: processingOrder1.orderStartTime,
        orderUpdatedTime: processingOrder1.orderUpdatedTime,
        guestNote: processingOrder1.guestNote,
      });
    });

    test('should return 400 if order table is wrong', async () => {
      orderData.orderTable = 3;
      await insertOrder(order);

      await request(providerApp).post('/v1/order/view-order').send(orderData).expect(httpStatus.BAD_REQUEST);
    });

    test(`should return 400 if order id doesn't exist`, async () => {
      delete orderData.orderId;
      await insertOrder(order);

      await request(providerApp).post('/v1/order/view-order').send(orderData).expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('POST /v1/order/upload-order', () => {
    let orderData;
    beforeEach(() => {
      orderData = {
        orderTable: 3,
        orderId: order._id,
        orderItem: [
          {
            itemName: 'beef roll',
            itemPrice: 9.8,
            itemNumber: 3,
            specialNote: 'no spicy',
          },
          {
            itemName: 'salmon roll',
            itemPrice: 12.8,
            itemNumber: 5,
          },
        ],
        totalPrice: 93.4,
        time: '2023-08-19T12:34:56.789Z',
        guestNote: 'ASAP',
      };
    });

    test('should return 200 and successfully upload the order data', async () => {
      await insertUser(user);
      await insertRestaurant(restaurant);
      await insertOrder(order);

      await request(providerApp).post('/v1/order/upload-order').send(orderData).expect(httpStatus.CREATED);
      const res = await request(app)
        .get('/v1/order/get-processing-order')
        .query({ token: userOrderAccessToken })
        .send()
        .expect(httpStatus.OK);

      expect(res.body.processingOrder[2]).toEqual({
        id: expect.anything(),
        orderTable: orderData.orderTable,
        orderItem: expect.anything(),
        totalPrice: orderData.totalPrice,
        orderStartTime: orderData.time,
        guestNote: orderData.guestNote,
      });
    });

    test('should return 200 and successfully update a existing order data', async () => {
      await insertUser(user);
      await insertRestaurant(restaurant);
      await insertOrder(order);

      await request(providerApp).post('/v1/order/upload-order').send(orderData).expect(httpStatus.CREATED);
      orderData.totalPrice = 100;
      await request(providerApp).post('/v1/order/upload-order').send(orderData).expect(httpStatus.CREATED);
      const res = await request(app)
        .get('/v1/order/get-processing-order')
        .query({ token: userOrderAccessToken })
        .send()
        .expect(httpStatus.OK);

      expect(res.body.processingOrder[2]).toEqual({
        id: expect.anything(),
        orderTable: orderData.orderTable,
        orderItem: expect.anything(),
        totalPrice: 100,
        orderStartTime: orderData.time,
        orderUpdatedTime: orderData.time,
        guestNote: orderData.guestNote,
      });
    });

    test(`should return 400 if order id doesn't exist`, async () => {
      delete orderData.orderId;
      await insertOrder(order);

      await request(providerApp).post('/v1/order/upload-order').send(orderData).expect(httpStatus.BAD_REQUEST);
    });
  });
});
