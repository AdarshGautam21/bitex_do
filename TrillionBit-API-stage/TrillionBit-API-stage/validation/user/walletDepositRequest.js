const Validator = require("validator");
const isEmpty = require("../isEmpty");

module.exports = function validateWalletDepositRequest(data) {
  let errors = {};

  data.amount = !isEmpty(data.amount) ? data.amount : "";
  data.coin = !isEmpty(data.coin) ? data.coin : "";

  if (isEmpty(data.amount)) {
    errors.depositAmount = "Please enter amount to deposit.";
  } else {
    if (data.coin === 'INR') {
      if (parseFloat(data.amount) < 1000) {
        errors.depositAmount = "Minimum amount to deposit is 1000 INR";
      }
      // if (data.referenceNumber) {
      //   errors.referenceNumber = "referenceNumber field required.";
      // }
    }

    if (data.coin === 'AED') {
      if (parseFloat(data.amount) < 200) {
        errors.depositAmount = "Minimum amount to deposit is 200 AED";
      }
      // if (data.referenceNumber) {
      //   errors.referenceNumber = "referenceNumber field required.";
      // }

    }

    if (data.coin === 'USD') {
      if (parseFloat(data.amount) < 50) {
        errors.depositAmount = "Minimum amount to deposit is 50 USD";
      }
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
