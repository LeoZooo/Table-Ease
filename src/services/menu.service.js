const httpStatus = require('http-status');
const { Menu, Dishes } = require('../models');

const ApiError = require('../utils/ApiError');

/**
 * Update menu
 * @param {string} userId
 * @param {Promise<Menu>} menu
 * @param {Promise<Dishes>} dishes
 */
const updateMenu = async (userId, menu, dish) => {
  const categoryList = menu.category;
  const { name, feature, category, id } = dish;
  Object.assign(menu, {
    dishes: menu.dishes ? [...menu.dishes, { id, name }] : [{ id, name }],
    feature: feature ? [...menu.feature, { id, name }] : menu.feature,
    category:
      categoryList && categoryList[category]
        ? { ...categoryList, [category]: [...categoryList[category], { id, name }] }
        : { ...categoryList, [category]: [{ id, name }] },
    updateBy: userId,
  });
  await menu.save();
};

/**
 * Delete dish in menu
 * @param {string} userId
 * @param {Promise<Menu>} menu
 * @param {Promise<Dishes>} dishes
 */
const deleteMenu = async (userId, menu, dish) => {
  const { name, category } = dish;
  let menuCategory = menu.category;
  Object.assign(menu, {
    dishes: menu.dishes.filter((eachDish) => eachDish.name !== name),
    feature: menu.feature.filter((eachDish) => eachDish.name !== name),
    category: { ...menuCategory, [category]: menuCategory[category].filter((eachDish) => eachDish.name !== name) },
    updateBy: userId,
  });
  // Reassign the menucategory value after modified
  menuCategory = menu.category;
  if (menuCategory[category].length === 0) {
    delete menuCategory[category];
  }
  await menu.save();
};

/**
 * Find dishes
 * @param {Promise<Menu>} menu
 * @param {string} name
 * @returns {Promise<Dishes>}
 */
const findDishes = async (menu, { name }) => {
  const dish = menu.dishes.find((eachDish) => eachDish.name === name);
  if (!dish) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Dish doesn't exist in restaurant menu");
  }
  const dishes = await Dishes.findById(dish.id);
  if (!dishes) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Dish doesn't exist in dishes database");
  }
  return { dishes };
};

/**
 * Get deatiled dishes
 * @param {Array} dishes
 * @returns {Array}
 */
const getDetailedDishes = async (menu, dishes) => {
  return Promise.all(
    dishes.map(async (eachDish) => {
      const tmp = await findDishes(menu, eachDish);
      return tmp;
    })
  );
};

/**
 * Get dishes
 * @param {Promise<Menu>} Menu
 * @returns {Array}
 */
const getDishes = async (menu) => {
  if (!menu) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Menu doesn't exist`);
  }
  let { dishes } = menu;
  dishes = await getDetailedDishes(menu, dishes);
  return { dishes };
};

/**
 * Get feature
 * @param {Promise<Menu>} Menu
 * @returns {Array}
 */
const getFeature = async (menu) => {
  if (!menu) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Menu doesn't exist`);
  }
  let { feature } = menu;
  feature = await getDetailedDishes(menu, feature);
  return { feature };
};

/**
 * Get dishes on category
 * @param {Promise<Menu>} Menu
 * @returns {Object}
 */
const getCategory = async (menu) => {
  if (!menu) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Menu doesn't exist`);
  }
  const { category } = menu;
  const keys = Object.keys(category);
  keys.forEach(async (key) => {
    category[key] = await getDetailedDishes(menu, category[key]);
  });
  return { category };
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
  let savedMenu = await Menu.findById(restaurant.menuId);
  // first time, create a menu table
  if (!restaurant.menuId || !savedMenu) {
    savedMenu = await Menu.create({
      restaurantId: restaurant._id,
      updateBy: userId,
    });

    Object.assign(restaurant, { menuId: savedMenu._id });
    await restaurant.save();
  }

  // If dish name already exist in menu, throw an error
  if (await Dishes.findOne({ menuId: restaurant.menuId, name: updateBody.name })) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Dish already exist');
  }

  const savedDish = await Dishes.create({ ...updateBody, menuId: savedMenu._id, updateBy: userId });
  await updateMenu(userId, savedMenu, savedDish);
  return { dishes: savedDish };
};

/**
 * Delete dishes
 * @param {string} userId
 * @param {Promise<Menu>} menu
 * @param {string} name
 * @returns {Promise<Dishes>}
 */
const deleteDishes = async (userId, menu, { name }) => {
  let savedDish = await findDishes(menu, { name });
  savedDish = savedDish.dishes;

  await deleteMenu(userId, menu, savedDish);
  await savedDish.remove();
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
  let savedDish = await findDishes(menu, { name: pastName });
  savedDish = savedDish.dishes;

  if (updateBody.name && menu.dishes.find((eachDish) => eachDish.name === updateBody.name) && pastName !== updateBody.name) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name already exist');
  }
  await deleteMenu(userId, menu, savedDish);
  Object.assign(savedDish, { ...updateBody, updateBy: userId });
  await savedDish.save();
  await updateMenu(userId, menu, savedDish);

  return { dishes: savedDish };
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
  return { menu };
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
  return { menu };
};

module.exports = {
  getDishes,
  getFeature,
  getCategory,
  addDishes,
  findDishes,
  deleteDishes,
  updateDishes,
  sortFeature,
  sortCategory,
};
