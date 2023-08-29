const setupTestDB = require('../../utils/setupTestDB');
const getUser = require('../../../src/middlewares/getUser');
const getRestaurant = require('../../../src/middlewares/getRestaurant');
const { user, restaurant } = require('../../fixtures/restaurant.fixture');
const { userRestAccessToken } = require('../../fixtures/token.fixture');
const { insertUser, insertRestaurant } = require('../../fixtures/dataInsertController.fixture');

setupTestDB();

describe('Get user middlewares', () => {
  let mockReq;
  let mockRes;
  let mockNext;
  beforeEach(() => {
    mockReq = {
      query: { token: userRestAccessToken },
    };
    mockRes = {};
    mockNext = jest.fn();
  });

  test('should successfully get the restaurant data', async () => {
    await insertUser(user);
    await insertRestaurant(restaurant);
    await getUser(mockReq, mockRes, mockNext);
    await getRestaurant(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.restaurant).toMatchObject({
      restaurantToken: '123456',
      name: 'Japanese restaurant',
      table: 8,
    });
  });

  test(`should continue if restaurant doesn't exist`, async () => {
    await insertUser(user);
    await getUser(mockReq, mockRes, mockNext);
    await getRestaurant(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});
