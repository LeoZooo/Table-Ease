const setupTestDB = require('../../utils/setupTestDB');
const getUser = require('../../../src/middlewares/getUser');
const { user } = require('../../fixtures/restaurant.fixture');
const { userRestAccessToken } = require('../../fixtures/token.fixture');
const { insertUser } = require('../../fixtures/dataInsertController.fixture');

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

  test('should successfully get the user data', async () => {
    await insertUser(user);
    await getUser(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.user).toMatchObject({
      name: user.name,
      email: user.email,
      gender: 4,
      isEmailVerified: false,
      role: 'staff',
    });
  });

  test(`should continue if user doesn't exist`, async () => {
    await getUser(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  test('should undefined if token is invaild', async () => {
    mockReq.query.token = '123';
    await insertUser(user);
    await getUser(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.user).toBeUndefined();
  });
});
