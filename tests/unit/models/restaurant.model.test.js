const { Restaurant } = require('../../../src/models');

describe('Restaurant model validation', () => {
  let newRestaurant;
  beforeEach(() => {
    newRestaurant = {
      name: 'Japanese restaurant',
      table: 8,
      restaurantToken: '123456',
      description: 'Fanshion style Janpanese restaurant located in Downtown',
      headImg: 'xxxxyyyy',
    };
  });

  test('should correctly validate a valid restaurant', async () => {
    await expect(new Restaurant(newRestaurant).validate()).resolves.toBeUndefined();
  });

  test('should throw a validation error if no name', async () => {
    newRestaurant.name = '';
    await expect(new Restaurant(newRestaurant).validate()).rejects.toThrow();
  });

  test('should throw a validation error if no table', async () => {
    newRestaurant.table = 0;
    await expect(new Restaurant(newRestaurant).validate()).rejects.toThrow();
  });

  test('should throw a validation error if restaurantToken invaild', async () => {
    newRestaurant.restaurantToken = '123';
    await expect(new Restaurant(newRestaurant).validate()).rejects.toThrow();
  });
});
