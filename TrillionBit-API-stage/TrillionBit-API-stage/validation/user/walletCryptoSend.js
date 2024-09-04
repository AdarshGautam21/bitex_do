const Validator = require("validator");
const isEmpty = require("../isEmpty");

module.exports = function validateWalletCryptoSend(data) {
  let errors = {};

  data.reciepientAddress = !isEmpty(data.reciepientAddress) ? data.reciepientAddress : "";
  data.reciepientAmount = !isEmpty(data.reciepientAmount) ? data.reciepientAmount : "";

  if (Validator.isEmpty(data.reciepientAddress)) {
    errors.reciepientAddress = "Reciepient address field is required";
  }

  if (Validator.isEmpty(data.reciepientAmount)) {
    errors.reciepientAmount = "Reciepient amount field is required";
  }

  if (parseFloat(data.reciepientAmount) <= 0 || isNaN(parseFloat(data.reciepientAmount)) || data.reciepientAmount.includes(' ')) {
    errors.reciepientAmount = "Please enter valid amount to withdraw";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
