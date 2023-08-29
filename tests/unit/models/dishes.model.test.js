const mongoose = require('mongoose');
const { Dishes } = require('../../../src/models');

describe('Dishes model validation', () => {
  let newDishes;
  beforeEach(() => {
    newDishes = {
      menuId: mongoose.Types.ObjectId(),
      name: 'Salmon Roll',
      description: 'Good taste and valuable',
      image: 'xxxxxxxx',
      price: 3.8,
      category: 'roll',
      updateBy: mongoose.Types.ObjectId(),
    };
  });

  test('should correctly validate a valid dishes', async () => {
    await expect(new Dishes(newDishes).validate()).resolves.toBeUndefined();
  });

  test('should throw a validation error if no menuId', async () => {
    newDishes.menuId = '';
    await expect(new Dishes(newDishes).validate()).rejects.toThrow();
  });

  test('should throw a validation error if no name', async () => {
    newDishes.name = '';
    await expect(new Dishes(newDishes).validate()).rejects.toThrow();
  });

  test('should throw a validation error if feature is not boolean', async () => {
    newDishes.feature = '';
    await expect(new Dishes(newDishes).validate()).rejects.toThrow();
  });

  test('should throw a validation error if price', async () => {
    newDishes.price = '';
    await expect(new Dishes(newDishes).validate()).rejects.toThrow();
  });

  test('should throw a validation error if no update user', async () => {
    newDishes.updateBy = '';
    await expect(new Dishes(newDishes).validate()).rejects.toThrow();
  });
});
