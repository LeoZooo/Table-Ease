const request = require('supertest');
const httpStatus = require('http-status');
const { app } = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const getUser = require('../../src/middlewares/getUser');
const config = require('../../src/config/config');
const { Restaurant } = require('../../src/models');
const { user, restaurant } = require('../fixtures/restaurant.fixture');
const { userRestAccessToken } = require('../fixtures/token.fixture');
const { insertUser, insertRestaurant } = require('../fixtures/dataInsertController.fixture');

setupTestDB();
app.use(getUser);

describe('Restaurant routes', () => {
  describe('GET /v1/rest/get-rest', () => {
    test('should return 200 and successfully get the restaurant data', async () => {
      await insertUser(user);
      await insertRestaurant(restaurant);

      const res = await request(app)
        .get('/v1/rest/get-rest')
        .query({ token: userRestAccessToken })
        .send()
        .expect(httpStatus.OK);
      expect(res.body).toEqual({
        id: expect.anything(),
        restaurantToken: restaurant.restaurantToken,
        name: restaurant.name,
        table: restaurant.table,
      });
    });

    test(`should return 400 if user doesn't connect a restaurant`, async () => {
      await insertUser(user);

      await request(app)
        .get('/v1/rest/get-rest')
        .query({ token: userRestAccessToken })
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('POST /v1/rest/register-rest', () => {
    let newRestaurant;
    let verificationCode;
    beforeEach(() => {
      newRestaurant = {
        restaurantToken: '654321',
        name: 'Chinese restaurant',
        table: 12,
      };
      verificationCode = config.verificationCode;
      delete user.restaurantId;
    });

    test('should return 200 and create if user successfully register a restaurant', async () => {
      await insertUser(user);

      const res = await request(app)
        .post('/v1/rest/register-rest')
        .query({ token: userRestAccessToken })
        .send({ ...newRestaurant, verificationCode })
        .expect(httpStatus.CREATED);

      expect(res.body.restaurant).toEqual({
        id: expect.anything(),
        orderId: expect.anything(),
        restaurantToken: newRestaurant.restaurantToken,
        name: newRestaurant.name,
        table: newRestaurant.table,
      });

      const dbRestaurant = await Restaurant.findById(res.body.restaurant.id);
      expect(dbRestaurant).toBeDefined();
      expect(dbRestaurant).toMatchObject({
        restaurantToken: newRestaurant.restaurantToken,
        name: newRestaurant.name,
        table: newRestaurant.table,
      });
    });

    test('should return 400 if user already connect a restaurant', async () => {
      user.restaurantId = restaurant._id;
      await insertUser(user);

      await request(app)
        .post('/v1/rest/register-rest')
        .query({ token: userRestAccessToken })
        .send({ ...newRestaurant, verificationCode })
        .expect(httpStatus.BAD_REQUEST);
    });

    test(`should return 401 if user's verificationCode is wrong`, async () => {
      verificationCode = '000000';
      await insertUser(user);

      await request(app)
        .post('/v1/rest/register-rest')
        .query({ token: userRestAccessToken })
        .send({ ...newRestaurant, verificationCode })
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 if restaurant name already taken', async () => {
      await insertUser(user);

      await request(app)
        .post('/v1/rest/register-rest')
        .query({ token: userRestAccessToken })
        .send({ ...newRestaurant, verificationCode });

      await request(app)
        .post('/v1/rest/register-rest')
        .query({ token: userRestAccessToken })
        .send({ ...newRestaurant, verificationCode })
        .expect(httpStatus.BAD_REQUEST);
    });

    user.restaurantId = restaurant._id;
  });

  describe('POST /v1/rest/connect-rest', () => {
    let name;
    let restaurantToken;
    beforeEach(() => {
      name = restaurant.name;
      restaurantToken = restaurant.restaurantToken;
      delete user.restaurantId;
    });

    test('should return 200 and connect a restaurant', async () => {
      await insertUser(user);
      await insertRestaurant(restaurant);

      const res = await request(app)
        .post('/v1/rest/connect-rest')
        .query({ token: userRestAccessToken })
        .send({ name, restaurantToken })
        .expect(httpStatus.OK);

      expect(res.body.restaurant).toEqual({
        id: expect.anything(),
        restaurantToken: restaurant.restaurantToken,
        name: restaurant.name,
        table: restaurant.table,
      });
    });

    test('should return 400 if user already connect a restaurant', async () => {
      user.restaurantId = restaurant._id;
      await insertUser(user);
      await insertRestaurant(restaurant);

      await request(app)
        .post('/v1/rest/connect-rest')
        .query({ token: userRestAccessToken })
        .send({ name, restaurantToken })
        .expect(httpStatus.BAD_REQUEST);
    });

    test(`should return 400 if restaurant name is wrong`, async () => {
      name = 'Chinese restaurant';
      await insertUser(user);
      await insertRestaurant(restaurant);

      await request(app)
        .post('/v1/rest/connect-rest')
        .query({ token: userRestAccessToken })
        .send({ name, restaurantToken })
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if restaurant token is wrong', async () => {
      restaurantToken = '654321';
      await insertUser(user);
      await insertRestaurant(restaurant);

      await request(app)
        .post('/v1/rest/connect-rest')
        .query({ token: userRestAccessToken })
        .send({ name, restaurantToken })
        .expect(httpStatus.BAD_REQUEST);

      user.restaurantId = restaurant._id;
    });
  });

  describe('DELETE /v1/rest/disconnect-rest', () => {
    test('should return 204 if successfully disconnect a restaurant', async () => {
      await insertUser(user);
      await insertRestaurant(restaurant);

      await request(app)
        .delete('/v1/rest/disconnect-rest')
        .query({ token: userRestAccessToken })
        .send()
        .expect(httpStatus.NO_CONTENT);
    });

    test(`should return 400 if user doesn't connect a restaurant`, async () => {
      delete user.restaurantId;
      await insertUser(user);
      await insertRestaurant(restaurant);

      await request(app)
        .delete('/v1/rest/disconnect-rest')
        .query({ token: userRestAccessToken })
        .send()
        .expect(httpStatus.BAD_REQUEST);

      user.restaurantId = restaurant._id;
    });
  });

  describe('PATCH /v1/rest/update-rest-profile', () => {
    let updatedRestaurant;
    beforeEach(() => {
      updatedRestaurant = {
        restaurantToken: '654321',
        table: 12,
        description: 'Fanshion style Janpanese restaurant located in CBD',
        headImg: 'xxxxxxxxxx',
      };
    });

    test('should return 200 if successfully update a restaurant info', async () => {
      await insertUser(user);
      await insertRestaurant(restaurant);

      const res = await request(app)
        .patch('/v1/rest/update-rest-profile')
        .query({ token: userRestAccessToken })
        .send(updatedRestaurant)
        .expect(httpStatus.OK);

      expect(res.body.restaurant).toEqual({
        id: expect.anything(),
        restaurantToken: updatedRestaurant.restaurantToken,
        name: restaurant.name,
        table: updatedRestaurant.table,
        description: updatedRestaurant.description,
        headImg: updatedRestaurant.headImg,
      });

      const dbRestaurant = await Restaurant.findById(res.body.restaurant.id);
      expect(dbRestaurant).toMatchObject({
        restaurantToken: updatedRestaurant.restaurantToken,
        table: updatedRestaurant.table,
        description: updatedRestaurant.description,
        headImg: updatedRestaurant.headImg,
      });
    });

    test(`should return 400 if user doesn't connect a restaurant`, async () => {
      delete user.restaurantId;
      await insertUser(user);
      await insertRestaurant(restaurant);

      await request(app)
        .patch('/v1/rest/update-rest-profile')
        .query({ token: userRestAccessToken })
        .send(updatedRestaurant)
        .expect(httpStatus.BAD_REQUEST);

      user.restaurantId = restaurant._id;
    });

    test('should return 400 if user update a wrong restaurantToken', async () => {
      updatedRestaurant.restaurantToken = '000';
      await insertUser(user);
      await insertRestaurant(restaurant);

      await request(app)
        .patch('/v1/rest/update-rest-profile')
        .query({ token: userRestAccessToken })
        .send(updatedRestaurant)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('PATCH /v1/rest/update-rest', () => {
    let updatedRestaurant;
    beforeEach(() => {
      updatedRestaurant = {
        pastName: 'Japanese restaurant',
        name: 'Australian restaurant',
        restaurantToken: '654321',
        table: 12,
        description: 'Fanshion style Janpanese restaurant located in CBD',
        headImg: 'xxxxxxxxxx',
      };
    });

    test('should return 200 if successfully update a restaurant info', async () => {
      await insertUser(user);
      await insertRestaurant(restaurant);

      const res = await request(app).patch('/v1/rest/update-rest').send(updatedRestaurant).expect(httpStatus.OK);

      expect(res.body.restaurant).toEqual({
        id: expect.anything(),
        restaurantToken: updatedRestaurant.restaurantToken,
        name: updatedRestaurant.name,
        table: updatedRestaurant.table,
        description: updatedRestaurant.description,
        headImg: updatedRestaurant.headImg,
      });

      const dbRestaurant = await Restaurant.findById(res.body.restaurant.id);
      expect(dbRestaurant).toMatchObject({
        name: updatedRestaurant.name,
        restaurantToken: updatedRestaurant.restaurantToken,
        table: updatedRestaurant.table,
        description: updatedRestaurant.description,
        headImg: updatedRestaurant.headImg,
      });
    });

    test('should return 400 if restaurant name already token', async () => {
      await insertUser(user);
      await insertRestaurant(restaurant);

      await request(app).patch('/v1/rest/update-rest').send(updatedRestaurant).expect(httpStatus.OK);

      await request(app).patch('/v1/rest/update-rest').send(updatedRestaurant).expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /v1/rest/delete-rest', () => {
    test('should return 204 if successfully delete a restaurant', async () => {
      await insertRestaurant(restaurant);

      await request(app).delete('/v1/rest/delete-rest').send({ name: restaurant.name }).expect(httpStatus.NO_CONTENT);

      const dbUser = await Restaurant.findById(restaurant._id);
      expect(dbUser).toBeNull();
    });

    test(`should return 400 if restaurant name doesn't exist`, async () => {
      await insertRestaurant(restaurant);

      await request(app).delete('/v1/rest/delete-rest').send({ name: 'Chinese restaurant' }).expect(httpStatus.BAD_REQUEST);
    });
  });
});
