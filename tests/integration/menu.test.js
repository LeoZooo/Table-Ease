const request = require('supertest');
const httpStatus = require('http-status');
const { app } = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const getUser = require('../../src/middlewares/getUser');
const getRestaurant = require('../../src/middlewares/getRestaurant');
const getMenu = require('../../src/middlewares/getMenu');
const { Dishes } = require('../../src/models');
const { user, restaurant, menu, dishes1, dishes2, dishes3, dishes4 } = require('../fixtures/menuAndDishes.fixture');
const { userMenuAccessToken } = require('../fixtures/token.fixture');
const { insertUser, insertRestaurant, insertMenu, insertDishes } = require('../fixtures/dataInsertController.fixture');

setupTestDB();
app.use(getUser);
app.use(getRestaurant);
app.use(getMenu);

describe('Menu routes', () => {
  describe('GET /v1/menu/get-dishes', () => {
    test('should return 200 and successfully get the dishes data', async () => {
      await insertUser(user);
      await insertRestaurant(restaurant);
      await insertMenu(menu);
      await insertDishes([dishes1, dishes2, dishes3, dishes4]);

      const res = await request(app)
        .get('/v1/menu/get-dishes')
        .query({ token: userMenuAccessToken })
        .send()
        .expect(httpStatus.OK);

      expect(res.body.dishes[0].dishes).toEqual({
        id: expect.anything(),
        menuId: expect.anything(),
        name: dishes1.name,
        price: dishes1.price,
        feature: dishes1.feature,
        category: dishes1.category,
        updateBy: expect.anything(),
      });
    });

    test('should return 400 and if no menu exist', async () => {
      await insertUser(user);
      delete restaurant.menuId;
      await insertRestaurant(restaurant);

      await request(app)
        .get('/v1/menu/get-dishes')
        .query({ token: userMenuAccessToken })
        .send()
        .expect(httpStatus.BAD_REQUEST);

      restaurant.menuId = menu._id;
    });

    test('should return 200 and get void if no dishes on menu', async () => {
      await insertUser(user);
      await insertRestaurant(restaurant);
      const tmpDishes = menu.dishes;
      menu.dishes = [];
      await insertMenu(menu);

      const res = await request(app)
        .get('/v1/menu/get-dishes')
        .query({ token: userMenuAccessToken })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        dishes: [],
      });

      menu.dishes = tmpDishes;
    });
  });

  describe('GET /v1/menu/get-feature', () => {
    test('should return 200 and successfully get the feature data', async () => {
      await insertUser(user);
      await insertRestaurant(restaurant);
      await insertMenu(menu);
      await insertDishes([dishes1, dishes2, dishes3, dishes4]);

      const res = await request(app)
        .get('/v1/menu/get-feature')
        .query({ token: userMenuAccessToken })
        .send()
        .expect(httpStatus.OK);

      expect(res.body.feature[0].dishes).toEqual({
        id: expect.anything(),
        menuId: expect.anything(),
        name: dishes1.name,
        price: dishes1.price,
        feature: dishes1.feature,
        category: dishes1.category,
        updateBy: expect.anything(),
      });
    });

    test('should return 200 and get void if no feature on menu', async () => {
      await insertUser(user);
      await insertRestaurant(restaurant);
      const tmpFeature = menu.feature;
      menu.feature = [];
      await insertMenu(menu);

      const res = await request(app)
        .get('/v1/menu/get-feature')
        .query({ token: userMenuAccessToken })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        feature: [],
      });

      menu.feature = tmpFeature;
    });
  });

  describe('GET /v1/menu/get-category', () => {
    test('should return 200 and successfully get the category data', async () => {
      await insertUser(user);
      await insertRestaurant(restaurant);
      await insertMenu(menu);
      await insertDishes([dishes1, dishes2, dishes3, dishes4]);

      const res = await request(app)
        .get('/v1/menu/get-category')
        .query({ token: userMenuAccessToken })
        .send()
        .expect(httpStatus.OK);

      expect(res.body.category).toHaveProperty('roll');
      expect(res.body.category).toHaveProperty('sashimi');
      expect(res.body.category).toHaveProperty('other');
    });
  });

  describe('POST /v1/menu/add-dishes', () => {
    let newDishes;
    beforeEach(() => {
      newDishes = {
        name: 'Salmon Sashimi',
        price: 10.8,
        feature: true,
        category: 'sashimi',
      };
    });

    test('should return 201 and successfully add the dishes data', async () => {
      await insertUser(user);
      await insertRestaurant(restaurant);
      await insertMenu(menu);

      const res = await request(app)
        .post('/v1/menu/add-dishes')
        .query({ token: userMenuAccessToken })
        .send(newDishes)
        .expect(httpStatus.CREATED);

      expect(res.body.dishes).toEqual({
        id: expect.anything(),
        menuId: expect.anything(),
        name: newDishes.name,
        price: newDishes.price,
        feature: newDishes.feature,
        category: newDishes.category,
        updateBy: expect.anything(),
      });

      const dbDishes = await Dishes.findById(res.body.dishes.id);
      expect(dbDishes).toBeDefined();
      expect(dbDishes).toMatchObject({
        name: newDishes.name,
        price: newDishes.price,
        feature: newDishes.feature,
        category: newDishes.category,
      });
    });

    test(`should return 201 and successfully add the dishes data if restaurant doen't have menu`, async () => {
      await insertUser(user);
      delete restaurant.menuId;
      await insertRestaurant(restaurant);

      const res = await request(app)
        .post('/v1/menu/add-dishes')
        .query({ token: userMenuAccessToken })
        .send(newDishes)
        .expect(httpStatus.CREATED);

      expect(res.body.dishes).toEqual({
        id: expect.anything(),
        menuId: expect.anything(),
        name: newDishes.name,
        price: newDishes.price,
        feature: newDishes.feature,
        category: newDishes.category,
        updateBy: expect.anything(),
      });

      const dbDishes = await Dishes.findById(res.body.dishes.id);
      expect(dbDishes).toBeDefined();
      expect(dbDishes).toMatchObject({
        name: newDishes.name,
        price: newDishes.price,
        feature: newDishes.feature,
        category: newDishes.category,
      });

      restaurant.menuId = menu._id;
    });

    test('should return 400 and if dishes name already exist', async () => {
      await insertUser(user);
      await insertRestaurant(restaurant);
      await insertMenu(menu);
      await insertDishes([dishes1]);

      await request(app)
        .post('/v1/menu/add-dishes')
        .query({ token: userMenuAccessToken })
        .send(newDishes)
        .expect(httpStatus.BAD_REQUEST);
    });

    test(`should return 400 and if dishes name doesn't exist`, async () => {
      delete newDishes.name;
      await insertUser(user);
      await insertRestaurant(restaurant);
      await insertMenu(menu);

      await request(app)
        .post('/v1/menu/add-dishes')
        .query({ token: userMenuAccessToken })
        .send(newDishes)
        .expect(httpStatus.BAD_REQUEST);
    });

    test(`should return 400 and if dishes price doesn't exist`, async () => {
      delete newDishes.price;
      await insertUser(user);
      await insertRestaurant(restaurant);
      await insertMenu(menu);

      await request(app)
        .post('/v1/menu/add-dishes')
        .query({ token: userMenuAccessToken })
        .send(newDishes)
        .expect(httpStatus.BAD_REQUEST);
    });

    test(`should return 200 and successfully add the dishes data if restaurant doen't have feature`, async () => {
      delete newDishes.feature;
      await insertUser(user);
      await insertRestaurant(restaurant);
      await insertMenu(menu);

      const res = await request(app)
        .post('/v1/menu/add-dishes')
        .query({ token: userMenuAccessToken })
        .send(newDishes)
        .expect(httpStatus.CREATED);

      expect(res.body.dishes).toEqual({
        id: expect.anything(),
        menuId: expect.anything(),
        name: newDishes.name,
        price: newDishes.price,
        feature: false,
        category: newDishes.category,
        updateBy: expect.anything(),
      });

      const dbDishes = await Dishes.findById(res.body.dishes.id);
      expect(dbDishes).toBeDefined();
      expect(dbDishes).toMatchObject({
        feature: false,
      });
    });

    test(`should return 200 and successfully add the dishes data if restaurant doen't have category`, async () => {
      delete newDishes.category;
      await insertUser(user);
      await insertRestaurant(restaurant);
      await insertMenu(menu);

      const res = await request(app)
        .post('/v1/menu/add-dishes')
        .query({ token: userMenuAccessToken })
        .send(newDishes)
        .expect(httpStatus.CREATED);

      expect(res.body.dishes).toEqual({
        id: expect.anything(),
        menuId: expect.anything(),
        name: newDishes.name,
        price: newDishes.price,
        feature: newDishes.feature,
        category: 'other',
        updateBy: expect.anything(),
      });

      const dbDishes = await Dishes.findById(res.body.dishes.id);
      expect(dbDishes).toBeDefined();
      expect(dbDishes).toMatchObject({
        category: 'other',
      });
    });
  });

  describe('POST /v1/menu/find-dishes', () => {
    test('should return 200 and successfully get the dishes data', async () => {
      await insertUser(user);
      await insertRestaurant(restaurant);
      await insertMenu(menu);
      await insertDishes([dishes1, dishes2, dishes3, dishes4]);

      const res = await request(app)
        .post('/v1/menu/find-dishes')
        .query({ token: userMenuAccessToken })
        .send({ name: dishes1.name })
        .expect(httpStatus.OK);

      expect(res.body.dishes).toEqual({
        id: expect.anything(),
        menuId: expect.anything(),
        name: dishes1.name,
        price: dishes1.price,
        feature: dishes1.feature,
        category: dishes1.category,
        updateBy: expect.anything(),
      });
    });

    test('should return 400 if no dishes found', async () => {
      await insertUser(user);
      await insertRestaurant(restaurant);
      await insertMenu(menu);
      await insertDishes([dishes1, dishes2, dishes3, dishes4]);

      await request(app)
        .post('/v1/menu/find-dishes')
        .query({ token: userMenuAccessToken })
        .send({ name: 'beef' })
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if no dishes in the menu', async () => {
      await insertUser(user);
      await insertRestaurant(restaurant);
      const tmpDishes = menu.dishes;
      menu.dishes = [];
      await insertMenu(menu);
      await insertDishes([dishes1, dishes2, dishes3, dishes4]);

      await request(app)
        .post('/v1/menu/find-dishes')
        .query({ token: userMenuAccessToken })
        .send({ name: dishes1.name })
        .expect(httpStatus.BAD_REQUEST);

      menu.dishes = tmpDishes;
    });
  });

  describe('DELETE /v1/menu/delete-dishes', () => {
    test('should return 204 and successfully delete the dishes data', async () => {
      await insertUser(user);
      await insertRestaurant(restaurant);
      await insertMenu(menu);
      await insertDishes([dishes1, dishes2, dishes3, dishes4]);

      await request(app)
        .delete('/v1/menu/delete-dishes')
        .query({ token: userMenuAccessToken })
        .send({ name: dishes1.name })
        .expect(httpStatus.NO_CONTENT);

      const dbDishes = await Dishes.findById(dishes1._id);
      expect(dbDishes).toBeNull();
    });

    test('should return 400 if no dishes found', async () => {
      await insertUser(user);
      await insertRestaurant(restaurant);
      await insertMenu(menu);
      await insertDishes([dishes1, dishes2, dishes3, dishes4]);

      await request(app)
        .delete('/v1/menu/delete-dishes')
        .query({ token: userMenuAccessToken })
        .send({ name: 'beef' })
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('PATCH /v1/menu/update-dishes', () => {
    let newDishes;
    beforeEach(() => {
      newDishes = {
        name: 'Salmon Deluxe Sashimi',
        price: 18.8,
        feature: false,
        category: 'sashimi',
        description: 'double salmon double enjoying',
        image: 'xxxxxxxxxx',
      };
    });

    test('should return 200 and successfully update the dishes data', async () => {
      await insertUser(user);
      await insertRestaurant(restaurant);
      await insertMenu(menu);
      await insertDishes([dishes1, dishes2, dishes3, dishes4]);

      const res = await request(app)
        .patch('/v1/menu/update-dishes')
        .query({ token: userMenuAccessToken })
        .send({ pastName: dishes1.name, ...newDishes })
        .expect(httpStatus.OK);

      expect(res.body.dishes).toEqual({
        id: expect.anything(),
        menuId: expect.anything(),
        name: newDishes.name,
        price: newDishes.price,
        feature: newDishes.feature,
        category: newDishes.category,
        description: newDishes.description,
        image: newDishes.image,
        updateBy: expect.anything(),
      });

      const dbDishes = await Dishes.findById(dishes1._id);
      expect(dbDishes).toMatchObject({
        name: newDishes.name,
        price: newDishes.price,
        feature: newDishes.feature,
        category: newDishes.category,
        description: newDishes.description,
        image: newDishes.image,
      });
    });

    test('should return 200 and successfully update the dishes data without name', async () => {
      delete newDishes.name;
      delete newDishes.price;
      await insertUser(user);
      await insertRestaurant(restaurant);
      await insertMenu(menu);
      await insertDishes([dishes1, dishes2, dishes3, dishes4]);

      const res = await request(app)
        .patch('/v1/menu/update-dishes')
        .query({ token: userMenuAccessToken })
        .send({ pastName: dishes1.name, ...newDishes })
        .expect(httpStatus.OK);

      expect(res.body.dishes).toEqual({
        id: expect.anything(),
        menuId: expect.anything(),
        name: dishes1.name,
        price: dishes1.price,
        feature: newDishes.feature,
        category: newDishes.category,
        description: newDishes.description,
        image: newDishes.image,
        updateBy: expect.anything(),
      });

      const dbDishes = await Dishes.findById(dishes1._id);
      expect(dbDishes).toMatchObject({
        name: dishes1.name,
        price: dishes1.price,
        feature: newDishes.feature,
        category: newDishes.category,
        description: newDishes.description,
        image: newDishes.image,
      });
    });

    test('should return 400 if no dishes found', async () => {
      await insertUser(user);
      await insertRestaurant(restaurant);
      await insertMenu(menu);
      await insertDishes([dishes1, dishes2, dishes3, dishes4]);

      await request(app)
        .patch('/v1/menu/update-dishes')
        .query({ token: userMenuAccessToken })
        .send({ pastName: 'beef', ...newDishes })
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if name already exist', async () => {
      await insertUser(user);
      await insertRestaurant(restaurant);
      await insertMenu(menu);
      await insertDishes([dishes1, dishes2, dishes3, dishes4]);

      await request(app)
        .patch('/v1/menu/update-dishes')
        .query({ token: userMenuAccessToken })
        .send({ pastName: dishes1.name, ...newDishes, name: dishes2.name })
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('POST /v1/menu/sort-feature', () => {
    let newFeature;
    beforeEach(() => {
      newFeature = [menu.feature[1], menu.feature[0]];
    });

    test('should return 200 and successfully sort feature', async () => {
      await insertUser(user);
      await insertRestaurant(restaurant);
      await insertMenu(menu);

      const res = await request(app)
        .post('/v1/menu/sort-feature')
        .query({ token: userMenuAccessToken })
        .send({ feature: newFeature })
        .expect(httpStatus.OK);

      expect(res.body.menu.feature[0]).toEqual({
        name: dishes4.name,
        id: expect.anything(),
      });
    });
  });

  describe('POST /v1/menu/sort-catefory', () => {
    let newCategory;
    beforeEach(() => {
      newCategory = {
        sashimi: [{ name: dishes1.name, id: dishes1._id }],
        other: [{ name: dishes3.name, id: dishes3._id }],
        roll: [
          { name: dishes4.name, id: dishes4._id },
          { name: dishes2.name, id: dishes2._id },
        ],
      };
    });

    test('should return 200 and successfully sort category', async () => {
      await insertUser(user);
      await insertRestaurant(restaurant);
      await insertMenu(menu);

      const res = await request(app)
        .post('/v1/menu/sort-category')
        .query({ token: userMenuAccessToken })
        .send({ category: newCategory })
        .expect(httpStatus.OK);

      const { category } = res.body.menu;
      const keys = Object.keys(category);
      expect(category[keys[0]][0]).toMatchObject({
        name: dishes1.name,
      });
      expect(category[keys[2]][1]).toMatchObject({
        name: dishes2.name,
      });
    });
  });
});
