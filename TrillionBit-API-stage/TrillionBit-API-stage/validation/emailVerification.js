const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateEmailVerificationInput(data) {
  let errors = {};

  data.verificationCode = !isEmpty(data.verificationCode) ? data.verificationCode : "";

  if (Validator.isEmpty(data.verificationCode)) {
    errors.verificationCode = "Please enter verification code";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
