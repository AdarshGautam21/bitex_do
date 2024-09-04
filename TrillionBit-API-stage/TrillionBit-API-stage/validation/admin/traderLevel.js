const Validator = require("validator");
const isEmpty = require("../isEmpty");

module.exports = function validateTraderLevelInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.fromAmount = !isEmpty(data.fromAmount) ? data.fromAmount : "";
  data.toAmount = !isEmpty(data.toAmount) ? data.toAmount : "";
  data.makerFee = !isEmpty(data.makerFee) ? data.makerFee : "";
  data.takerFee = !isEmpty(data.takerFee) ? data.takerFee : "";

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if (Validator.isEmpty(data.fromAmount)) {
    errors.fromAmount = "From Amount field is required";
  }

  if (Validator.isEmpty(data.toAmount)) {
    errors.toAmount = "To Amount field is required";
  }

  if (Validator.isEmpty(data.makerFee)) {
    errors.makerFee = "Maker Fee field is required";
  }

  if (Validator.isEmpty(data.takerFee)) {
    errors.takerFee = "Taker Fee field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
