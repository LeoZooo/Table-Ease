const MUST_CONTAIN_NUMBER = /\d/;
const MUST_CONTAIN_LETTER = /[a-zA-Z]/;
const NUMBERS_ONLY = /^[0-9]+$/;
const VAILD_MONGO_ID = /^[0-9a-fA-F]{24}$/;

module.exports = {
  MUST_CONTAIN_NUMBER,
  MUST_CONTAIN_LETTER,
  NUMBERS_ONLY,
  VAILD_MONGO_ID,
};
