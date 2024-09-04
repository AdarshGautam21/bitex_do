const Validator = require("validator");
const isEmpty = require("../isEmpty");

module.exports = function validateUserPersonalInfo(data) {
  let errors = {};

  data.streetAddress = !isEmpty(data.streetAddress) ? data.streetAddress : "";
  data.postalCode = !isEmpty(data.postalCode) ? data.postalCode : "";
  data.city = !isEmpty(data.city) ? data.city : "";
  data.country = !isEmpty(data.country) ? data.country : "";

  if (Validator.isEmpty(data.streetAddress)) {
    errors.streetAddress = "Address field is required";
  }

  if (isEmpty(data.postalCode.toString())) {
    errors.postalCode = "Postal code field is required";
  }

  if (Validator.isEmpty(data.city)) {
    errors.city = "City field is required";
  }

  if (Validator.isEmpty(data.country)) {
    errors.country = "Country field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
