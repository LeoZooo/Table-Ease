const mongoose = require('mongoose');
const { Menu } = require('../../../src/models');

describe('Menu model validation', () => {
  let newMenu;
  beforeEach(() => {
    newMenu = {
      restaurantId: mongoose.Types.ObjectId(),
      dishes: [],
      feature: [],
      category: {},
      updateBy: mongoose.Types.ObjectId(),
    };
  });

  test('should correctly validate a valid menu', async () => {
    await expect(new Menu(newMenu).validate()).resolves.toBeUndefined();
  });

  test('should throw a validation error if no restaurantId', async () => {
    newMenu.restaurantId = '';
    await expect(new Menu(newMenu).validate()).rejects.toThrow();
  });

  test('should throw a validation error if no update user', async () => {
    newMenu.updateBy = '';
    await expect(new Menu(newMenu).validate()).rejects.toThrow();
  });
});
