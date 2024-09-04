const Validator = require("validator");
const isEmpty = require("../isEmpty");

module.exports = function validateCorporateInfoFirst(data) {
  let errors = {};

  data.firstname = !isEmpty(data.firstname) ? data.firstname : "";
  data.lastname = !isEmpty(data.lastname) ? data.lastname : "";
  data.dateOfBirth = !isEmpty(data.dateOfBirth) ? data.dateOfBirth : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.phone = !isEmpty(data.phone) ? data.phone : "";
  data.nationality = !isEmpty(data.nationality) ? data.nationality : "";
  data.officeAddress = !isEmpty(data.officeAddress) ? data.officeAddress : "";
  data.officeCity = !isEmpty(data.officeCity) ? data.officeCity : "";
  data.officeZip = !isEmpty(data.officeZip) ? data.officeZip : "";
  data.officeCountry = !isEmpty(data.officeCountry) ? data.officeCountry : "";

  if (Validator.isEmpty(data.firstname)) {
    errors.firstname = "First name field is required";
  }

  if (Validator.isEmpty(data.lastname)) {
    errors.lastname = "Last name field is required";
  }

  if (Validator.isEmpty(data.dateOfBirth)) {
    errors.dateOfBirth = "Date of birth field is required";
  }

  if (isEmpty(data.email.toString())) {
    errors.email = "Email field is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.phone)) {
    errors.phone = "Phone is required";
  }

  if (Validator.isEmpty(data.officeAddress)) {
    errors.officeAddress = "Address field is required";
  }

  if (isEmpty(data.officeZip.toString())) {
    errors.officeZip = "zip code field is required";
  }

  if (Validator.isEmpty(data.officeCity)) {
    errors.officeCity = "City field is required";
  }

  if (Validator.isEmpty(data.officeCountry)) {
    errors.officeCountry = "Country field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
