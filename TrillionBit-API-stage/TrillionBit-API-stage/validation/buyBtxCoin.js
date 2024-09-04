const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function buyBtxCoinValidation(data) {
  let errors = {};
  const {btxBuyDetail} = data;
  btxBuyDetail.price = !isEmpty(btxBuyDetail.price ) ? btxBuyDetail.price  : "";
  btxBuyDetail.amount = !isEmpty(btxBuyDetail.amount ) ? btxBuyDetail.amount  : "";

  if (Validator.isEmpty(btxBuyDetail.amount)) {
    errors.reciepientAddress = "Btx field is required";
  }

  if (Validator.isEmpty(btxBuyDetail.price)) {
    errors.reciepientAmount = "Pay field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
