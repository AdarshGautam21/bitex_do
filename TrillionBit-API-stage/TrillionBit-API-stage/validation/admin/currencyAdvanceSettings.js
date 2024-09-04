const Validator = require("validator");
const isEmpty = require("../isEmpty");

module.exports = function validateCurrencyAdvanceSettingsInput(data) {
  let errors = {};

  data.settingName = !isEmpty(data.settingName) ? data.settingName : "";
  data.value = !isEmpty(data.value) ? data.value : "";

  if (Validator.isEmpty(data.settingName)) {
    errors.settingName = "Setting field is required";
  }

  if (Validator.isEmpty(data.value)) {
    errors.value = "Value field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
