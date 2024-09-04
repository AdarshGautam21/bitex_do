const Validator = require("validator");
const isEmpty = require("../isEmpty");

module.exports = function validateMarketOrderInput(data) {
  let errors = {};

  data.amount = !isEmpty(data.amount) ? data.amount : "";

  if (Validator.isEmpty(data.amount)) {
    errors.amount = "Enter value to place an order";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
