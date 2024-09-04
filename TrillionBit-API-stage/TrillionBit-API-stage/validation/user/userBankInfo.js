const Validator = require("validator");
const isEmpty = require("../isEmpty");

module.exports = function validateUserPersonalInfo(data) {
  let errors = {};

  data.bankName = !isEmpty(data.bankName) ? data.bankName : "";
  data.bankAccount = !isEmpty(data.bankAccount) ? data.bankAccount : "";
  data.bankAddress = !isEmpty(data.bankAddress) ? data.bankAddress : "";
  // data.bankSwift = !isEmpty(data.bankSwift) ? data.bankSwift : "";
  data.bankIban = !isEmpty(data.bankIban) ? data.bankIban : "";
  // data.bankCurrency = !isEmpty(data.bankCurrency) ? data.bankCurrency : "";
  data.bankCity = !isEmpty(data.bankCity) ? data.bankCity : "";

  if (Validator.isEmpty(data.bankName)) {
    errors.bankName = "Bank name field is required";
  }

  if (isEmpty(data.bankAccount.toString())) {
    errors.bankAccount = "Bank account field is required";
  }

  if (Validator.isEmpty(data.bankAddress)) {
    errors.bankAddress = "Bank address is required";
  }

  // if (Validator.isEmpty(data.bankSwift)) {
  //   errors.bankSwift = "Bank swift field is required";
  // }

  // if (isEmpty(data.bankIban.toString())) {
  //   errors.bankIban = "IBAN field is required";
  // }

  // if (Validator.isEmpty(data.bankCurrency)) {
  //   errors.bankCurrency = "Bank currency field is required";
  // }

  if (Validator.isEmpty(data.bankCity)) {
    errors.bankCity = "Bank city field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
