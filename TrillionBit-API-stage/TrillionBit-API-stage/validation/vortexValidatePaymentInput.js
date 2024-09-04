const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validatePaymentInput(data) {
  let errors = {};
  const paymentDetails =  JSON.parse(data.paymentDetails);
  data.paymentOption = !isEmpty(data.paymentOption) ? data.paymentOption : "";

  if (Validator.isEmpty(data.paymentOption)) {
    errors.paymentOption = "Please select option Type";
  }

  if(Validator.isEmpty(paymentDetails.mopType)) {
    errors.mopType = "mopType field is required";
  }

  switch(data.paymentOption) {
    case "CC":
    case "DC":

      if(Validator.isEmpty(paymentDetails.cardNumber)) {
        errors.cardNumber = "Please enter card number";
      }
      if(Validator.isEmpty(paymentDetails.cardExpDt)) {
        errors.cardExpDt = "Please enter card expiry date";
      }
      if(Validator.isEmpty(paymentDetails.cvv)) {
        errors.cvv = "Please enter cvv";
      }
      // if( Validator.isLength(paymentDetails.cardNumber, {min: 3, max: 3}) ) {
      //   errors.cvv = "Please enter valid cvv";
      // }
      break;

    case "UP":
      if(Validator.isEmpty(paymentDetails.upi)) {
        errors.cvv = "Please enter VPA.";
      }

      break;

    default:
       
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
