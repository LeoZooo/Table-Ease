const atLeastOneNumber = /\d/;
const atLeatOneLetter = /[a-zA-Z]/;
const onlyNumber = /^[0-9]+$/;
const validMongoId = /^[0-9a-fA-F]{24}$/;

module.exports = {
  atLeastOneNumber,
  atLeatOneLetter,
  onlyNumber,
  validMongoId,
};
