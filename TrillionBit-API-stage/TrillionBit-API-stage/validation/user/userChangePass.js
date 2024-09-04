const Validator = require("validator");
const isEmpty = require("../isEmpty");

module.exports = function validateUserChangePass(data) {
  let errors = {};

  data.oldPassword = !isEmpty(data.oldPassword) ? data.oldPassword : "";
  data.newPassword = !isEmpty(data.newPassword) ? data.newPassword : "";
  data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : "";


  if (Validator.isEmpty(data.oldPassword)) {
    errors.oldPassword = "Old Password field is required";
  }

  if (Validator.isEmpty(data.newPassword)) {
    errors.newPassword = "New Password field is required";
  }

  if (!Validator.isLength(data.newPassword, { min: 6, max: 30 })) {
    errors.newPassword = "Password must be at least 6 characters";
  }

  if (Validator.isEmpty(data.confirmPassword)) {
    errors.confirmPassword = "Confirm Password field is required";
  }

  if (!Validator.equals(data.newPassword, data.confirmPassword)) {
    errors.confirmPassword = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
