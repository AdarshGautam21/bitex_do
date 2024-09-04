const Validator = require("validator");
const isEmpty = require("../isEmpty");

module.exports = function validateRepayMarginBalance(data) {
  let errors = {};

  data.repayAmount = !isEmpty(data.repayAmount) ? data.repayAmount : "";
  data.userMarginWalletId = !isEmpty(data.userMarginWalletId) ? data.userMarginWalletId : "";

  if (Validator.isEmpty(data.repayAmount) || parseFloat(data.repayAmount) <= 0) {
    errors.repayAmount = "Amount field is required";
  }

  if (Validator.isEmpty(data.userMarginWalletId)) {
    errors.userMarginWalletId = "Please select a wallet";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
