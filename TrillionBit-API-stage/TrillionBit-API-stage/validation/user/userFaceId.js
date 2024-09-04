const Validator = require("validator");
const isEmpty = require("../isEmpty");

module.exports = function validateUserFaceIdPass(data) {
  let errors = {};

  data.faceIdPassword = !isEmpty(data.faceIdPassword) ? data.faceIdPassword : "";

  if (Validator.isEmpty(data.faceIdPassword)) {
    errors.faceIdPassword = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
