const Validator = require("validator");
const isEmpty = require("../isEmpty");

module.exports = function validateBorrowMarginBalance(data) {
  let errors = {};

  data.borrowAmount = !isEmpty(data.borrowAmount) ? data.borrowAmount : "";
  data.userMarginWalletId = !isEmpty(data.userMarginWalletId) ? data.userMarginWalletId : "";

  if (Validator.isEmpty(data.borrowAmount)) {
    errors.borrowAmount = "Amount field is required";
  }

  if (Validator.isEmpty(data.userMarginWalletId)) {
    errors.userMarginWalletId = "Please select a wallet";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
