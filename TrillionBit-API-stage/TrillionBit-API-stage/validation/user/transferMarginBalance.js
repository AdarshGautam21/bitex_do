const Validator = require("validator");
const isEmpty = require("../isEmpty");

module.exports = function validateTransferMarginBalance(data) {
  let errors = {};

  data.userWalletId = !isEmpty(data.userWalletId) ? data.userWalletId : "";
  data.transferAmount = !isEmpty(data.transferAmount) ? data.transferAmount : "";
//   data.userPassword = !isEmpty(data.userPassword) ? data.userPassword : "";

  if (Validator.isEmpty(data.transferAmount)) {
    errors.transferAmount = "Amount field is required";
  }

//   if (Validator.isEmpty(data.userPassword)) {
//     errors.userPassword = "Password field is required";
//   }

  if (Validator.isEmpty(data.userWalletId)) {
      errors.userWalletId = "Please select wallet";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
