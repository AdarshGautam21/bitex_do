const Validator = require("validator");
const isEmpty = require("../isEmpty");

module.exports = function validateCreatWalletBonusInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.type = !isEmpty(data.type) ? data.type : "";
  data.value = !isEmpty(data.value) ? data.value : "";
  data.couponCode = !isEmpty(data.couponCode) ? data.couponCode : "";

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if (Validator.isEmpty(data.type)) {
    errors.type = "Type field is required";
  }

  if (Validator.isEmail(data.value)) {
    errors.value = "Value is invalid";
  }

  if (Validator.isEmail(data.couponCode)) {
    errors.couponCode = "coupanCode is invalid";
  }

  if (Validator.isEmail(data.coin)) {
    errors.couponCode = "coin is invalid";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = function validateUpdateWalletBonusInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.type = !isEmpty(data.type) ? data.type : "";
  data.value = !isEmpty(data.value) ? data.value : "";
  data.couponCode = !isEmpty(data.value) ? data.couponCode : "";

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if (Validator.isEmpty(data.type)) {
    errors.type = "Type field is required";
  }

  if (Validator.isEmail(data.value)) {
    errors.value = "Price is invalid";
  }
  if (Validator.isEmail(data.couponCode)) {
    errors.couponCode = "coupanCode is invalid";
  }

  if (Validator.isEmail(data.coin)) {
    errors.couponCode = "coin is invalid";
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
};
