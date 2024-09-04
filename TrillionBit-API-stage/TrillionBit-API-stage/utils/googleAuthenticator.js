var crypto = require("crypto");
var b32 = require("thirty-two");
var notp = require("notp");

function generateGoogleAuthenticatorSecret(email) {
  var bin = crypto.randomBytes(20);
  var base32 = b32.encode(bin).toString("utf8").replace(/=/g, "");
  var secret = base32
    .toLowerCase()
    .replace(/(\w{4})/g, "$1 ")
    .trim()
    .split(" ")
    .join("")
    .toUpperCase();
  var uri =
    "otpauth://totp/" +
    encodeURIComponent("Bitex") +
    encodeURIComponent(email ? ":" + email : "") +
    "%3Fsecret=" +
    secret;
  return {
    secret: secret,
    uri: uri,
    qr:
      "https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=" +
      uri,
  };
}

function verifyGoogleAuthOtp(secret, otp) {
  if (!secret || !secret.length || !otp || !otp.length) return null;
  const window = 4;
  var unformatted = secret.replace(/\W+/g, "").toUpperCase();
  var bin = b32.decode(unformatted);
  otp = otp.replace(/\W+/g, "");
  return notp.totp.verify(otp, bin, {
    window: window,
    time: 30,
  });
}

module.exports = exports = {
  generateGoogleAuthenticatorSecret: generateGoogleAuthenticatorSecret,
  verifyGoogleAuthOtp: verifyGoogleAuthOtp,
};
