const Validator = require("validator");
const isEmpty = require("../isEmpty");

module.exports = function validateLimitOrderInput(data) {
  let errors = {};

  data.amount = !isEmpty(data.amount) ? data.amount : "";
  data.price = !isEmpty(data.price) ? data.price : "";

  if (Validator.isEmpty(data.amount)) {
    errors.amount = "Enter value to place an order";
  }
  if (Validator.isEmpty(data.price)) {
    errors.amount = "Enter value to place an order";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
