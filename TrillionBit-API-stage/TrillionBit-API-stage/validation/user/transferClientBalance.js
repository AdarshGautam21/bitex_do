const Validator = require("validator");
const isEmpty = require("../isEmpty");

module.exports = function validateTransferClientBalance(data) {
  let errors = {};

  data.transferAmount = !isEmpty(data.transferAmount) ? data.transferAmount : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(data.transferAmount)) {
    errors.transferAmount = "Amount field is required";
  }

  if (Validator.isEmpty(data.agentPassword)) {
    errors.agentPassword = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
