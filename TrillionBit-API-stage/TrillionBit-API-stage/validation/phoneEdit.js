const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validatePhoneVerificationInput(data) {
  let errors = {};

  data.mobileNumber = !isEmpty(data.mobileNumber) ? data.mobileNumber : "";

  if (Validator.isEmpty(data.mobileNumber)) {
    errors.mobileNumber = "Please enter mobile number";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
