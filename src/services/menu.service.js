const httpStatus = require('http-status');
const { Menu, Dishes } = require('../models');

const ApiError = require('../utils/ApiError');

/**
 * Update menu
 * @param {string} userId
 * @param {Promise<Menu>} menu
 * @param {Promise<Dishes>} dishes
 * @param {array} dishes
 * @param {array} feature
 * @param {object} category
 * @returns {Promise<Menu>}
 */
const updateMenu = async (userId, menu, dishes) => {
  const categoryList = menu.category;
  const newFeature = dishes.feature;
  const newCategory = dishes.category;
  Object.assign(menu, {
    dishes: [...menu.dishes, dishes],
    feature: newFeature ? [...menu.feature, dishes] : menu.feature,
    category: categoryList[newCategory]
      ? { ...categoryList, newCategory: [...categoryList[newCategory], dishes] }
      : { ...categoryList, newCategory: [dishes] },
    updateBy: userId,
  });
  await menu.save();
};

/**
 * Add dishes
 * @param {string} userId
 * @param {Promise<Restaurant>} restaurant
 * @param {string} name
 * @param {string} description
 * @param {string} image
 * @param {number} price
 * @param {boolean} feature
 * @param {string} category
 * @returns {Promise<Dishes>}
 */
const addDishes = async (userId, restaurant, updateBody) => {
  const savedDishes = await Dishes.create({ ...updateBody, updateBy: userId });
  // first time, create a menu table
  if (!restaurant.menuId) {
    const savedMenu = await Menu.create({
      restaurantId: restaurant._id,
      dishes: [savedDishes],
      feature: savedDishes.feature ? [savedDishes] : [],
      category: { newCategory: [savedDishes] },
      updateBy: userId,
    });
    Object.assign(restaurant, { menuId: savedMenu._id });
    await restaurant.save();
  } else {
    const menu = await Menu.findById(restaurant.menuId);
    await updateMenu(userId, menu, savedDishes);
  }
  return savedDishes;
};

/**
 * Find dishes
 * @param {Promise<Menu>} menu
 * @param {string} name
 * @returns {Promise<Dishes>}
 */
const findDishes = async (menu, { name }) => {
  const dishes = menu.dishes.find((eachDish) => eachDish.name === name);
  if (!dishes) {
    throw new ApiError(httpStatus.BAD_REQUEST, "dishe doesn't exist");
  }
  return dishes;
};

/**
 * Delete dishes
 * @param {string} userId
 * @param {Promise<Menu>} menu
 * @param {string} name
 * @returns {Promise<Dishes>}
 */
const deleteDishes = async (userId, menu, { name }) => {
  const dishes = await findDishes(name);
  const newDishes = menu.dishes.filter((eachDish) => eachDish !== dishes);
  const feature = dishes.feature ? menu.feature.filter((eachDish) => eachDish !== dishes) : menu.feature;
  const menuCategory = menu.category[dishes.category];
  const category = {
    ...menu.catgory,
    menuCategory: menuCategory.filter((eachDish) => eachDish !== dishes),
  };
  Object.assign(menu, { dishes: newDishes, feature, category, updateBy: userId });
  menu.save();
  await dishes.remove();
};

/**
 * Update dishes
 * @param {string} userId
 * @param {Promise<Menu>} menu
 * @param {string} pastName
 * @param {string} name
 * @param {string} description
 * @param {string} image
 * @param {number} price
 * @param {boolean} feature
 * @param {string} category
 * @returns {Promise<Dishes>}
 */
const updateDishes = async (userId, menu, updateBody) => {
  const { pastName } = updateBody;
  const dishes = await findDishes(pastName);
  if (updateBody.name && menu.dishes.find((eachDish) => eachDish.name === updateBody.name) && pastName !== updateBody.name) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'name already exist');
  }
  Object.assign(dishes, { ...updateBody, updateBy: userId });
  await dishes.save();
  await updateMenu(userId, menu, dishes);
  return dishes;
};

/**
 * Sort feature
 * @param {string} userId
 * @param {Promise<Menu>} menu
 * @param {array} feature
 * @returns {Promise<Menu>}
 * */
const sortFeature = async (userId, menu, { feature }) => {
  Object.assign(menu, { feature, updateBy: userId });
  await menu.save();
  return menu;
};

/**
 * Sort Category
 * @param {string} userId
 * @param {Promise<Menu>} menu
 * @param {object} category
 * @returns {Promise<Menu>}
 * */
const sortCategory = async (userId, menu, { category }) => {
  Object.assign(menu, { category, updateBy: userId });
  await menu.save();
  return menu;
};

module.exports = {
  addDishes,
  findDishes,
  deleteDishes,
  updateDishes,
  sortFeature,
  sortCategory,
};
