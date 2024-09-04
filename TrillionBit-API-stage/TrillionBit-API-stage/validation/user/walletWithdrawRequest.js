const Validator = require("validator");
const isEmpty = require("../isEmpty");

module.exports = function validateWalletWithdrawRequest(data) {
  let errors = {};

  data.amount = !isEmpty(data.amount) ? data.amount : "";

  if (Validator.isEmpty(data.amount)) {
    errors.withdrawAmount = "Please enter amount to withdraw.";
  }
  if (data.amount < 200 && data.coin === 'AED') {
    errors.withdrawAmount = "Minimun amount to withdraw is 200 AED.";
  }
  if (data.amount < 1000 && data.coin === 'INR') {
    errors.withdrawAmount = "Minimun amount to withdraw is 1000 INR.";
  }
  if (data.amount < 50 && data.coin === 'USD') {
    errors.withdrawAmount = "Minimun amount to withdraw is 50 USD.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
