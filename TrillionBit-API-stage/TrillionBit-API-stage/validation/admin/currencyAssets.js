const Validator = require("validator");
const isEmpty = require("../isEmpty");

module.exports = function validateCurrencyAssetsInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.assetsId = !isEmpty(data.assetsId) ? data.assetsId : "";
  data.currency = !isEmpty(data.currency) ? data.currency : "";
  data.value = !isEmpty(data.value) ? data.value : "";

  if (Validator.isEmpty(data.name)) {
    errors.name = "BName field is required";
  }

  if (Validator.isEmpty(data.assetsId)) {
    errors.assetsId = "Please select assets";
  }

  if (Validator.isEmpty(data.currency)) {
    errors.currency = "Currency field is required";
  }

  if (Validator.isEmpty(data.value)) {
    errors.value = "Value field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
