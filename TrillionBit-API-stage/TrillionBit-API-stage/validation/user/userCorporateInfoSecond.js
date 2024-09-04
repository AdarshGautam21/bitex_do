const Validator = require("validator");
const isEmpty = require("../isEmpty");

module.exports = function validateCorporateInfoFirst(data) {
  let errors = {};

  data.fullLegleName = !isEmpty(data.fullLegleName) ? data.fullLegleName : "";
  data.numberOfDirectors = !isEmpty(data.numberOfDirectors) ? data.numberOfDirectors : "";
  data.incorporationDate = !isEmpty(data.incorporationDate) ? data.incorporationDate : "";
  data.bussinessType = !isEmpty(data.bussinessType) ? data.bussinessType : "";
  data.registrationNumber = !isEmpty(data.registrationNumber) ? data.registrationNumber : "";
  data.bankName = !isEmpty(data.bankName) ? data.bankName : "";
  data.bankAccountNumber = !isEmpty(data.bankAccountNumber) ? data.bankAccountNumber : "";
  data.bankAccountHolderName = !isEmpty(data.bankAccountHolderName) ? data.bankAccountHolderName : "";
  data.bankCountry = !isEmpty(data.bankCountry) ? data.bankCountry : "";

  if (Validator.isEmpty(data.fullLegleName)) {
    errors.fullLegleName = "Full legal name field is required";
  }

  if (Validator.isEmpty(data.numberOfDirectors)) {
    errors.numberOfDirectors = "Number of directors field is required";
  }

  if (Validator.isEmpty(data.incorporationDate)) {
    errors.incorporationDate = "Incorporate field is required";
  }

  if (Validator.isEmpty(data.bussinessType)) {
    errors.bussinessType = "Business type is required";
  }

  if (Validator.isEmpty(data.bankName)) {
    errors.bankName = "Bank Name field is required";
  }

  if (Validator.isEmpty(data.bankAccountNumber)) {
    errors.bankAccountNumber = "Bank account number field is required";
  }

  if (Validator.isEmpty(data.bankAccountHolderName)) {
    errors.bankAccountHolderName = "Account holder name field is required";
  }

  if (Validator.isEmpty(data.bankCountry)) {
    errors.bankCountry = "Bank country name field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
