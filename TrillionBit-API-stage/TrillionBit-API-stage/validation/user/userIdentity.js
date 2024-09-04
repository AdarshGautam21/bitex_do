const Validator = require("validator");
const isEmpty = require("../isEmpty");

module.exports = function validateUserIdentityInput(data) {
  let errors = {};

  data.userNationality = !isEmpty(data.userNationality) ? data.userNationality : "";

  if (Validator.isEmpty(data.userNationality)) {
    errors.userNationality = "Please select user's nationality.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
