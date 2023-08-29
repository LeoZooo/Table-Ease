const setupTestDB = require('../../utils/setupTestDB');
const getUser = require('../../../src/middlewares/getUser');
const getRestaurant = require('../../../src/middlewares/getRestaurant');
const getMenu = require('../../../src/middlewares/getMenu');
const { user, restaurant, menu } = require('../../fixtures/menuAndDishes.fixture');
const { userMenuAccessToken } = require('../../fixtures/token.fixture');
const { insertUser, insertRestaurant, insertMenu } = require('../../fixtures/dataInsertController.fixture');

setupTestDB();

describe('Get user middlewares', () => {
  let mockReq;
  let mockRes;
  let mockNext;
  beforeEach(() => {
    mockReq = {
      query: { token: userMenuAccessToken },
    };
    mockRes = {};
    mockNext = jest.fn();
  });

  test('should successfully get the menu data', async () => {
    await insertUser(user);
    await insertRestaurant(restaurant);
    await insertMenu(menu);
    await getUser(mockReq, mockRes, mockNext);
    await getRestaurant(mockReq, mockRes, mockNext);
    await getMenu(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.menu).toMatchObject({
      dishes: expect.any(Array),
      feature: expect.any(Array),
      category: expect.any(Object),
    });
  });

  test(`should continue if menu doesn't exist`, async () => {
    await insertUser(user);
    await insertRestaurant(restaurant);
    await getUser(mockReq, mockRes, mockNext);
    await getRestaurant(mockReq, mockRes, mockNext);
    await getMenu(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});
