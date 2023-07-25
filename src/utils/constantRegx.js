const atLeastOneNumber = /\d/;
const atLeastOneLetter = /[a-zA-Z]/;
const onlyNumber = /^[0-9]+$/;
const validMongoId = /^[0-9a-fA-F]{24}$/;

module.exports = {
  atLeastOneNumber,
  atLeastOneLetter,
  onlyNumber,
  validMongoId,
};
