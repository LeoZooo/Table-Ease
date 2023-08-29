const { MUST_CONTAIN_NUMBER, MUST_CONTAIN_LETTER, NUMBERS_ONLY, VAILD_MONGO_ID } = require('../utils/constantRegx');

const objectId = (value, helpers) => {
  if (!value.match(VAILD_MONGO_ID)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  if (!value.match(MUST_CONTAIN_NUMBER) || !value.match(MUST_CONTAIN_LETTER)) {
    return helpers.message('password must contain at least 1 letter and 1 number');
  }
  return value;
};

const restaurantToken = (value, helpers) => {
  if (value.length !== 6) {
    return helpers.message('token must be a six-digit number');
  }
  if (!value.match(NUMBERS_ONLY)) {
    return helpers.message('token must be a number string');
  }
  return value;
};

const orderItem = (value, helpers) => {
  if (value.length === 0) {
    return helpers.message('order items must have or more than one');
  }

  const allowedKeys = ['itemName', 'itemPrice', 'itemNumber', 'specialNote'];
  value.map((each) => {
    if (!each.itemName || !each.itemPrice || !each.itemNumber) {
      return helpers.message(`order items don't include key feature`);
    }
    const key = Object.keys(each);
    if (!allowedKeys.includes(key)) {
      return helpers.message('order items have not allowed key');
    }
    return each;
  });

  return value;
};

module.exports = {
  objectId,
  password,
  restaurantToken,
  orderItem,
};
