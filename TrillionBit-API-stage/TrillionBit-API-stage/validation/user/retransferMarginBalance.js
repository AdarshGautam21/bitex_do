const Validator = require("validator");
const isEmpty = require("../isEmpty");

module.exports = function validateTransferFromMarginBalance(data) {
  let errors = {};

  data.userMarginWalletId = !isEmpty(data.userMarginWalletId) ? data.userMarginWalletId : "";
  data.transferAmount = !isEmpty(data.transferAmount) ? data.transferAmount : "";
//   data.userPassword = !isEmpty(data.userPassword) ? data.userPassword : "";

  if (Validator.isEmpty(data.transferAmount)) {
    errors.transferAmount = "Amount field is required";
  }

//   if (Validator.isEmpty(data.userPassword)) {
//     errors.userPassword = "Password field is required";
//   }

  if (Validator.isEmpty(data.userMarginWalletId)) {
      errors.userMarginWalletId = "Please select wallet";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
