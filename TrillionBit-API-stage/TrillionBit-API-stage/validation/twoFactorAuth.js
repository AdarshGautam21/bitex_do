const Validator = require("validator");
const isEmpty = require("./isEmpty");

function validateTwoFactorAuthInput(data) {
  let errors = {};

  data.twoFactorAuth = !isEmpty(data.twoFactorAuth) ? data.twoFactorAuth : "";
  data.email = !isEmpty(data.email) ? data.email : "";

  if (Validator.isEmpty(data.twoFactorAuth)) {
    errors.twoFactorAuth = "2FA field is required";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

function validateGenerateTwoFactor(data) {
  let errors = {};

  data.twoFactorAuth = !isEmpty(data.twoFactorAuth) ? data.twoFactorAuth : "";
  data.email = !isEmpty(data.email) ? data.email : "";

  if (Validator.isEmpty(data.twoFactorAuth)) {
    errors.twoFactorAuth = "2FA field is required";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (data.twoFactorAuth !== "true" && data.twoFactorAuth !== "false") {
    errors.twoFactorAuth =
      "Two factor auth value should be either true or false";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

function verifyTwoFactor(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (!data.otp) {
    errors.otp = "Otp is required";
  } else if (!/\d/.test(data.otp)) {
    errors.otp = "Please enter only numbers";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

module.exports = {
  validateTwoFactorAuthInput,
  validateGenerateTwoFactor,
  verifyTwoFactor,
};
