const express = require("express");
const router = express.Router();
const axios = require("axios");
const gravatar = require("gravatar");
const TwinBcrypt = require("twin-bcrypt");
const bcrypt = require("bcrypt");
const keys = require("../../config/key");
const jwt = require("jsonwebtoken");
var base64 = require("base-64");
const dasshpeConfig = require("../../config/dasshpeConfig");
const vortexDasshpeConfig = require("../../config/vortexDasshpeConfig");

const validateRegisterInput = require("../../validation/register");
const {
  validateTwoFactorAuthInput,
  validateGenerateTwoFactor,
  verifyTwoFactor,
} = require("../../validation/twoFactorAuth");
const validateLoginInput = require("../../validation/login");
const validateForgotPasswordInput = require("../../validation/forgotPassword");
const validateResetPasswordInput = require("../../validation/resetPassword");
const validateEmailVerificationInput = require("../../validation/emailVerification");
const validateUserIdentityInput = require("../../validation/user/userIdentity");
const validatePaymentInput = require("../../validation/validatePaymentInput");
const vortexValidatePaymentInput = require("../../validation/vortexValidatePaymentInput");

const welcomeEmail = require("../../emails/WelcomeEmail");
const forgotEmail = require("../../emails/ForgotEmail");
const loginEmail = require("../../emails/LoginEmail");
const passport = require("passport");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const User = require("../../models/User");
const UserApi = require("../../models/UserApi");
const UserProfile = require("../../models/UserProfile");
const OnfidoUser = require("../../models/onfido/OnfidoUser");
const UserPersonalInfo = require("../../models/UserPersonalInfo");
const UserBankInfo = require("../../models/UserBankInfo");
const UserDocument = require("../../models/UserDocument");
const UserIdentity = require("../../models/UserIdentity");
const UserActivity = require("../../models/UserActivity");
const Referral = require("../../models/referral/Referral");
const ReferralTree = require("../../models/referral/ReferralTree");
const TraderLevel = require("../../models/trading/TraderLevel");
const AgentTraderLevel = require("../../models/agent/AgentTraderLevel");
const SubAgentTraderLevel = require("../../models/agent/SubAgentTraderLevel");
const AgentClientTraderLevel = require("../../models/agent/AgentClientTraderLevel");
const UserPayment = require("../../models/UserPayment");
const WalletController = require("../../controller/WalletController");
const UserWallet = require("../../models/UserWallet");
const UserDepositRequest = require("../../models/UserDepositRequest");
const VortexUserDepositRequest = require("../../models/VortexUserDepositRequest");
const VortexUser = require("../../models/VortexUser");
const WalletBonus = require("../../models/WalletBonus");
const UserBonusWalletHistory = require("../../models/UserBonusWalletHistory");

const depositEmail = require("../../emails/DepositEmail");
const verifiedDocEmail = require("../../emails/VerifiedDocEmail");
const resendDocEmail = require("../../emails/ResendDocEmail");
const isEmpty = require("../../validation/isEmpty");
const CurrencySetting = require("../../models/trading/CurrencySetting");
const Maintenance = require("../../models/maintenance/Maintenance");
const { async } = require("q");
const {
  generateGoogleAuthenticatorSecret,
  verifyGoogleAuthOtp,
} = require("../../utils/googleAuthenticator");

/**
 * @route POST /api/auth/generate-2fa
 * @description Enable or disable 2fa and generate secret for the first time
 * @access Public
 */
router.post("/generate-2fa", (req, res) => {
  try {
    const { errors, isValid } = validateGenerateTwoFactor(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          UserProfile.findOne({ userId: user._id })
            .then(async (userProfile) => {
              const data = generateGoogleAuthenticatorSecret(req.body.email);
              if (userProfile) {
                if (userProfile.twoFactorSecret) {
                  if (
                    userProfile.twoFactorAuth !==
                    JSON.parse(req.body.twoFactorAuth)
                  ) {
                    userProfile.profileComplete =
                      req.body.twoFactorAuth === "true"
                        ? userProfile.profileComplete + 20
                        : userProfile.profileComplete - 20;
                  }
                  userProfile.twoFactorAuth = req.body.twoFactorAuth;
                  await userProfile.save();
                  return res.status(200).json({ secretGenerated: false });
                }

                userProfile.twoFactorSecret = data.secret;
                userProfile.twoFactorAuth = req.body.twoFactorAuth;
                userProfile.profileComplete =
                  req.body.twoFactorAuth === "true"
                    ? userProfile.profileComplete + 20
                    : userProfile.profileComplete - 20;

                userProfile
                  .save()
                  .then((userProfile) => {
                    res.json({
                      secretKey: data.secret,
                      qr: data.qr,
                      secretGenerated: true,
                    });
                  })
                  .catch((err) => {
                    res.json({
                      variant: "error",
                      message: "Falied to enable, try again",
                    });
                  });
              } else {
                const newUserProfile = new UserProfile({
                  userId: user._id,
                  twoFactorSecret: req.body.twoFactorSecret,
                  twoFactorAuth: req.body.twoFactorAuth,
                  profileComplete: 20,
                });

                newUserProfile
                  .save()
                  .then((userProfile) => {
                    res.json({
                      secretKey: data.secret,
                      qr: data.qr,
                      secretGenerated: true,
                    });
                  })
                  .catch((err) => {
                    res.json({
                      variant: "error",
                      message: "Falied to enable, try again",
                    });
                  });
              }
            })
            .catch((err) => {
              console.log("INSIDE ERROR ----");
              return res.status(400).json({ email: "User not found." });
            });
        } else {
          return res.status(400).json({ email: "User not found." });
        }
      })
      .catch((err) => {
        console.log("INSIDE ERROR ----");
        return res.status(400).json({ email: "User not found." });
      });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

/**
 * @route GET /api/auth/test
 * @description Test auth route
 * @access Public
 */
router.get("/test", (req, res) => res.json({ msg: "Auth works" }));

router.post("/reset-password", (req, res) => {
  const { errors, isValid } = validateResetPasswordInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  let decodedEmail = base64.decode(req.body.emailToken);

  User.findOne({ email: decodedEmail }).then((user) => {
    // Check for user
    if (!user) {
      return res.status(404).json({ email: "User not found." });
    }

    TwinBcrypt.hash(req.body.password, function (hash) {
      // Store hash in your password DB.
      user.password = hash;
      user
        .save()
        .then((user) => {
          res.json({ message: "Password successfully updated." });
        })
        .catch((err) => console.log(err));
    });
  });
});

router.post("/forgot-password", (req, res) => {
  const { errors, isValid } = validateForgotPasswordInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      let encodedEmail = base64.encode(req.body.email);
      let emailBody = forgotEmail(
        req.body.email,
        keys.hostURI + "/reset-password/" + encodedEmail
      );
      // let emailBody = '<p>Click below link to reset or copy given url and open in browser to reset</p>';
      // emailBody += '<p><a href="'+ keys.hostURI +'/reset-password/' + encodedEmail +'"><button>Reset Password</button></a></p>';
      // emailBody += '<p>' + keys.hostURI +'/reset-password/' + encodedEmail + '</p>';

      const mailOptions = {
        from: { name: "Trillionbit", email: "noreply@trillionbit.com" }, // sender address
        to: user.email, // list of receivers
        subject: "Reset your password", // Subject line
        html: emailBody, // plain text body
      };

      try {
        sgMail.send(mailOptions);
      } catch (error) {
        console.log(error);
      }

      res.json({
        variant: "success",
        message: "Reset link successfully sent to your email.",
      });
    } else {
      return res.status(400).json({ email: "User not found." });
    }
  });
});

get_user_profile_status = async (userProfile) => {
  let result = [];
  let pendingResult = {};
  let userIdentity = await UserIdentity.findOne({ userId: userProfile.userId });

  let userPersoalInfo = await UserPersonalInfo.findOne({
    userId: userProfile.userId,
  });
  if (!userPersoalInfo) {
    result.push("Complete basic information");
    pendingResult.basicInfo = false;
  }

  let userBankInfo = await UserBankInfo.findOne({ userId: userProfile.userId });
  if (!userBankInfo) {
    result.push("Complete bank information");
    pendingResult.bankInfo = false;
  }

  if (!userProfile.twoFactorAuth) {
    result.push("Enable 2FA for security");
    pendingResult.twoFactor = false;
  }
  if (userIdentity) {
    if (!userIdentity.approve) {
      result.push("Complete user identity verification");
      pendingResult.identity = false;
    }
  } else {
    result.push("Complete user identity verification");
    pendingResult.identity = false;
  }

  return { result, pendingResult };
};

get_trader_level = async (traderLevelValue, userId) => {
  let user = await User.findOne({ _id: userId });
  let isAgent = false;
  let isSubAgent = false;
  if (user) {
    isAgent = user.agent;
    isSubAgent = user.subAgent;
  }

  let result = {};
  let traderLevel;
  if (isAgent) {
    traderLevel = await AgentTraderLevel.findOne({ name: traderLevelValue });
  } else if (isSubAgent) {
    traderLevel = await SubAgentTraderLevel.findOne({ name: traderLevelValue });
  } else {
    let clientTraderLevel = await AgentClientTraderLevel.findOne({
      clientId: user._id,
      name: traderLevelValue,
    });
    if (clientTraderLevel) {
      traderLevel = clientTraderLevel;
    } else {
      if (user.country === "IN") {
        traderLevel = await InrTraderLevel.findOne({ name: traderLevelValue });
      } else {
        traderLevel = await TraderLevel.findOne({ name: traderLevelValue });
      }
    }
  }
  if (traderLevel) {
    result.takerFee = traderLevel.taker_fee;
    result.makerFee = traderLevel.maker_fee;
    return result;
  } else {
    return result;
  }
};

/**
 * @route GET /api/auth/user-details
 * @description Test auth route
 * @access Public
 */
router.get("/user-details/:userId", (req, res) => {
  User.findOne({ userId: req.params.userId }).then(async (user) => {
    if (user) {
      res.json(user);
    } else {
      return res.status(400).json({ email: "User not found." });
    }
  });
});

/**
 * @route GET /api/auth/user-profile
 * @description Test auth route
 * @access Public
 */
router.get("/user-profile/:userId", (req, res) => {
  UserProfile.findOne({ userId: req.params.userId }).then(
    async (userProfile) => {
      if (userProfile) {
        let response = {};
        let { result, pendingResult } =
          await get_user_profile_status(userProfile);
        let traderLevel = await get_trader_level(
          userProfile.traderLevel,
          req.params.userId
        );
        response.createdAt = userProfile.createdAt;
        response.emailVerificationCode = userProfile.emailVerificationCode;
        response.emailVerified = userProfile.emailVerified;
        response.monthlyVolume = userProfile.monthlyVolume;
        response.phoneVerified = userProfile.phoneVerified;
        response.profileComplete = userProfile.profileComplete;
        response.twoFactorAuth = userProfile.twoFactorAuth;
        response.twoFactorSecret = userProfile.twoFactorSecret;
        response.traderLevel = userProfile.traderLevel;
        response.updatedAt = userProfile.updatedAt;
        response.userId = userProfile.userId;
        response.faceId = userProfile.faceId;
        response._id = userProfile._id;
        response.statusMessages = result;
        response.traderLevelFees = traderLevel;
        response.pendingResult = pendingResult;
        res.json(response);
      } else {
        return res.status(400).json({ email: "User profile not found." });
      }
    }
  );
});

/**
 * @route GET /api/auth/user-documents
 * @description Test auth route
 * @access Public
 */
router.get("/user-documents/:userIdentityId", (req, res) => {
  UserDocument.find({ userIdentityId: req.params.userIdentityId }).then(
    (userDocuments) => {
      if (userDocuments) {
        res.json(userDocuments);
      } else {
        return res.status(400).json({ email: "User documents not found." });
      }
    }
  );
});

/**
 * @route GET /api/auth/user-identity/:userId
 * @description Return userIdentity object
 * @access Public
 */
router.get("/user-identity/:userId", (req, res) => {
  UserIdentity.findOne({ userId: req.params.userId }).then((userIdentity) => {
    if (userIdentity) {
      res.json(userIdentity);
    } else {
      return res.status(400).json({ userIdentity: "User identity not found" });
    }
  });
});

/**
 * @route GET /api/auth/user-identity
 * @description Create a userIdentity object
 * @access Public
 */
router.post("/user-identity", (req, res) => {
  const { errors, isValid } = validateUserIdentityInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ _id: req.body.userId }).then((user) => {
    if (user) {
      UserIdentity.findOne({ userId: user._id }).then((userIdentity) => {
        if (userIdentity) {
          userIdentity.userNationality = req.body.userNationality;
          userIdentity
            .save()
            .then((userIdentity) => {
              res.json(userIdentity);
            })
            .catch((err) => console.log(err));
        } else {
          const newUserIdentity = new UserIdentity({
            userId: user._id,
            userNationality: req.body.userNationality,
          });

          newUserIdentity
            .save()
            .then((userIdentity) => {
              res.json(userIdentity);
            })
            .catch((err) => console.log(err));
        }
      });
    } else {
      return res.status(400).json({ email: "User not found." });
    }
  });
});

/**
 * @route POST /api/auth/enable-2fa
 * @description Enable 2FA and returning user profile object or error
 * @access Public
 */
router.post("/enable-2fa", (req, res) => {
  const { errors, isValid } = validateTwoFactorAuthInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      UserProfile.findOne({ userId: user._id }).then((userProfile) => {
        if (userProfile) {
          userProfile.twoFactorSecret = req.body.twoFactorSecret;
          userProfile.twoFactorAuth = req.body.twoFactorAuth;
          userProfile.profileComplete =
            req.body.twoFactorAuth === "true"
              ? userProfile.profileComplete + 20
              : userProfile.profileComplete - 20;
          userProfile
            .save()
            .then((userProfile) => {
              res.json({
                variant: "success",
                message: "2FA successfully enabled",
              });
            })
            .catch((err) => {
              res.json({
                variant: "error",
                message: "Falied to enable, try again",
              });
            });
        } else {
          const newUserProfile = new UserProfile({
            userId: user._id,
            twoFactorSecret: req.body.twoFactorSecret,
            twoFactorAuth: req.body.twoFactorAuth,
            profileComplete: 20,
          });

          newUserProfile
            .save()
            .then((userProfile) => {
              res.json({
                variant: "success",
                message: "2FA successfully enabled",
              });
            })
            .catch((err) => {
              res.json({
                variant: "error",
                message: "Falied to enable, try again",
              });
            });
        }
      });
    } else {
      return res.status(400).json({ email: "User not found." });
    }
  });
});

/**
 * @route POST /api/auth/verify-2fa"
 * @description Verify 2FA code
 * @access Public
 */
router.post("/verify-2fa", (req, res) => {
  const { errors, isValid } = verifyTwoFactor(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      UserProfile.findOne({ userId: user._id }).then(async (userProfile) => {
        console.log({
          twoFactorAuth: userProfile.twoFactorAuth,
          secret: userProfile.twoFactorSecret,
        });
        if (
          !userProfile ||
          !userProfile.twoFactorSecret ||
          !userProfile.twoFactorAuth
        ) {
          return res
            .status(403)
            .send({ message: "Enable 2 factor authentication first!" });
        }

        const isCorrectOtp = verifyGoogleAuthOtp(
          userProfile.twoFactorSecret,
          req.body.otp
        );

        if (!isCorrectOtp) {
          return res.status(403).send({ message: "Invalid otp!" });
        }

        return res.status(200).send({ message: "Otp verified successfully" });
      });
    } else {
      return res.status(400).json({ email: "User not found." });
    }
  });
});

/**
 * @route GET /api/auth/resend-email-verification/:userEmail
 * @description Resend email verification
 * @access Public
 */
router.get("/resend-email-verification/:userEmail/:verifyType?", (req, res) => {
  const userEmail = base64.decode(req.params.userEmail);
  const verifyType = req.params.verifyType; // verify-user || verify-email-password;
  console.log({ verifyType });
  console.log({ userEmail });
  User.findOne({ email: userEmail })
    .then((user) => {
      if (user) {
        UserProfile.findOne({ userId: user._id })
          .then((userProfile) => {
            if (userProfile) {
              const emailVerificationCode = Math.floor(
                100000 + Math.random() * 900000
              );
              console.log({ emailVerificationCode });
              userProfile.emailVerificationCode = emailVerificationCode;
              userProfile.save();

              let emailBody;
              if (verifyType === "verify-user") {
                emailBody = welcomeEmail(
                  emailVerificationCode,
                  "https://trillionbit.com"
                );
              } else {
                emailBody =
                  "<p>Your verification code is " +
                  emailVerificationCode +
                  ". Please use this to reset your password.</p>";
              }

              const mailOptions = {
                from: { name: "Trillionbit", email: "noreply@trillionbit.com" }, // sender address
                to: user.email, // list of receivers
                subject: "Verify your account", // Subject line
                html: emailBody, // plain text body
              };

              try {
                sgMail.send(mailOptions);
              } catch (error) {
                console.log(error);
              }

              return res.json({
                variant: "success",
                verificationEmail: true,
                message: "Email sent successfully, please check your email",
              });
            } else {
              return res.status(400).json({
                variant: "error",
                message: "User profile not found.",
              });
            }
          })
          .catch((err) => {
            return res.status(400).json({
              variant: "error",
              message: "User profile not found.",
            });
          });
      } else {
        return res.status(400).json({
          variant: "error",
          message: "User not found.",
        });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        variant: "error",
        message: "User not found.",
      });
    });
});

/**
 * @route POST /api/auth/verify-email/:userEmail
 * @description Verify email address
 * @access Public
 */
router.post("/verify-email", (req, res) => {
  const { errors, isValid } = validateEmailVerificationInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json({
      verificationCode: errors.verificationCode,
      userEmail: req.body.secureCode,
    });
  }
  const verifyType = req.body.verifyType; // verify-user || verify-email-password -> Verify user means he is verifying the email and other means he is verifying for the password
  let userEmail = "";

  try {
    userEmail = base64.decode(req.body.secureCode);
  } catch (err) {
    res.status(400).json({
      verificationCode: "Something is wrong please contact support.",
      userEmail: req.body.secureCode,
    });
  }

  const verificationCode = req.body.verificationCode;

  User.findOne({ email: userEmail })
    .then((user) => {
      if (user) {
        user.active = true;
        user.save();
        UserProfile.findOne({ userId: user._id })
          .then((userProfile) => {
            if (userProfile) {
              if (userProfile.emailVerified && verifyType === "verify-user") {
                return res.json({
                  title: "Already Verified",
                  message: "User already verified.!",
                });
              } else {
                if (
                  userProfile.emailVerificationCode ===
                  parseInt(verificationCode)
                ) {
                  userProfile.emailVerified = true;
                  if (verifyType === "verify-user") {
                    userProfile.profileComplete =
                      userProfile.profileComplete + 13;
                  }

                  userProfile
                    .save()
                    .then((verfiedUser) => {
                      let emailBody = "";

                      if (verifyType === "verify-user") {
                        emailBody =
                          "<p>Your email " +
                          userEmail +
                          " successfully verified. Please login to access our servcie.</p>";

                        const mailOptions = {
                          from: {
                            name: "Trillionbit",
                            email: "noreply@trillionbit.com",
                          }, // sender address
                          to: userEmail, // list of receivers
                          subject: "Account successfully verified!", // Subject line
                          html: emailBody, // plain text body
                        };

                        try {
                          sgMail.send(mailOptions);
                        } catch (error) {
                          console.log(error);
                        }
                      }

                      res.json({
                        title:
                          verifyType === "verify-user"
                            ? "Email verified"
                            : "Otp Verified",
                        message:
                          verifyType === "verify-user"
                            ? "Email successfully verified. Please login to access our service."
                            : "Otp Verified please. Please reset your password",
                      });
                    })
                    .catch((err) =>
                      res.status(400).json({
                        verificationCode:
                          "Unknown error on verification please retry or contact to support.",
                        userEmail: req.body.secureCode,
                      })
                    );
                } else {
                  return res.status(400).json({
                    verificationCode:
                      "Wrong verification code, please check your email or resend code",
                    userEmail: req.body.secureCode,
                  });
                }
              }
            } else {
              return res.status(400).json({
                verificationCode: "User profile not found.",
                userEmail: req.body.secureCode,
              });
            }
          })
          .catch((err) =>
            res.status(400).json({
              verificationCode:
                "Unknown error on verification please retry or contact to support.",
              userEmail: req.body.secureCode,
            })
          );
      } else {
        return res.status(400).json({
          verificationCode: "User not found.",
          userEmail: req.body.secureCode,
        });
      }
    })
    .catch((err) =>
      res.status(400).json({
        verificationCode: "User not found.",
        userEmail: req.body.secureCode,
      })
    );
});

/**
 * @route Post /api/auth/register
 * @description Register user | returning user object or error
 * @access Public
 */
router.post("/register", async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(async (user) => {
    if (user) {
      return res.status(400).json({ email: "User already exists." });
    } else {
      // const avatar = gravatar.url(req.body.email, {
      //   s: '200', // Size
      //   r: 'pg', // Rating
      //   d: 'mm' // Default
      // });
      const dateOfBirth = req.body.dateOfBirth.trim();
      const firstname = req.body.firstname.toLowerCase().trim();
      const lastname = req.body.lastname.toLowerCase().trim();
      const existUser = await User.find({
        firstname: { $regex: new RegExp(firstname), $options: "i" },
        lastname: { $regex: new RegExp(lastname), $options: "i" },
        dateOfBirth: { $exists: true, $ne: null },
      });

      if (existUser) {
        const existedUser = existUser.find(
          (item) =>
            item.dateOfBirth.includes(dateOfBirth) &&
            item.lastname.includes(lastname) &&
            item.firstname.includes(firstname)
        );
        if (!isEmpty(existedUser)) {
          return res.status(400).json({
            email:
              "You already have a verified account. Please kindly note that one user can only open one account.",
          });
        }
      }

      const avatar = "user_logo.png";
      const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.countryCode + " " + req.body.phone,
        country: req.body.country,
        dateOfBirth: req.body.dateOfBirth,
        agent: req.body.agent ? req.body.agent : false,
        avatar,
        password: req.body.password,
      });

      TwinBcrypt.hash(newUser.password, function (hash) {
        // Store hash in your password DB.
        newUser.password = hash;
        newUser.save().then(async (user) => {
          const coin =
            req.body.country === "IN"
              ? "INR"
              : req.body.country === "AE"
                ? "AED"
                : "USD";
          const signupBonus = await WalletBonus.findOne({
            type: "signup",
            active: true,
            coin: coin,
          });
          if (signupBonus) {
            userBonusWalletHistory = new UserBonusWalletHistory({
              userId: user._id,
              bonusType: signupBonus.type,
              bonusAmount: signupBonus.value,
              coin: coin,
              approved: false,
            }).save();
          }

          const emailVerificationCode = Math.floor(
            100000 + Math.random() * 900000
          );

          const newUserProfile = new UserProfile({
            userId: user._id,
            emailVerificationCode: emailVerificationCode,
          });
          newUserProfile.save();

          const newUserIdentity = new UserIdentity({
            userId: user._id,
            userNationality: req.body.country,
          });
          newUserIdentity.save();

          const newUserPersonalInfo = new UserPersonalInfo({
            userId: user._id,
            country: req.body.country,
            verification: true,
          });
          newUserPersonalInfo.save();

          if (req.body.referralCode) {
            let referral = await Referral.findOne({
              uniquId: req.body.referralCode,
            });
            if (isEmpty(referral)) {
              referral = await Referral.findOne({
                referralCode: req.body.referralCode,
              });
            }
            if (!isEmpty(referral)) {
              referralTree = new ReferralTree();
              referralTree.referralId = referral._id;
              referralTree.referredUser = user._id;
              referralTree
                .save()
                .then((newReferralTree) => {
                  referral.numberOfReferrals = referral.numberOfReferrals + 1;
                  referral.save();
                })
                .catch((err) => {
                  //
                });
            }
          }

          let emailBody = welcomeEmail(
            emailVerificationCode,
            "https://www.trillionbit.com"
          );
          // emailBody += '<p>Verification Code: ' + emailVerificationCode + '</p>';

          const mailOptions = {
            from: { name: "Trillionbit", email: "noreply@trillionbit.com" }, // sender address
            to: newUser.email, // list of receivers
            subject: "Verify your account", // Subject line
            html: emailBody, // plain text body
          };

          try {
            sgMail.send(mailOptions);
          } catch (error) {
            console.log(error);
          }

          return res.json({
            title: "Please check your email.",
            message:
              "You have successfully registered please check you email to verify your account.",
          });
          process.exit();
        });
      });
    }
  });
});

sendLogEmail = (userParams, user) => {
  try {
    let emailBody = loginEmail(
      userParams.userIp,
      userParams.browserName +
        " (V" +
        userParams.fullBrowserVersion +
        ") " +
        userParams.osVersion,
      userParams.logTime,
      user.email
    );

    const mailOptions = {
      from: { name: "Trillionbit", email: "noreply@trillionbit.com" }, // sender address
      to: user.email, // list of receivers
      subject: "Login Information", // Subject line
      html: emailBody, // plain text body
    };

    try {
      sgMail.send(mailOptions);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log("Error in sending login email");
  }
};

/**
 * @route Post /api/auth/face_id_check
 * @description Face id status check
 * @access Public
 */
router.post("/face_id_check", (req, res) => {
  const biomatricDeviceId = req.body.biomatricDeviceId;

  User.findOne({ biomatricDeviceId: biomatricDeviceId })
    .then(async (user) => {
      // Check for user
      if (user) {
        let userProfile = await UserProfile.findOne({ userId: user._id });

        if (userProfile) {
          if (userProfile.faceId) {
            return res.json({ faceId: true });
          }
        } else {
          return res.json({ faceId: false });
        }
      } else {
        return res.json({ faceId: false });
      }
    })
    .catch((err) => {
      return res.json({ faceId: false });
    });
});

/**
 * @route Post /api/auth/generate_token
 * @description Login user | returning JWT Token
 * @access Public
 */
router.post("/generate_token", async (req, res) => {
  const apiKey = req.body.api_key;
  const apiSecret = req.body.api_secret;

  const userApi = await UserApi.findOne({
    apiKey: apiKey,
    apiSecret: apiSecret,
  });

  if (userApi) {
    const user = await User.findOne({ _id: userApi.userId });

    if (user) {
      if (!user.active || user.suspended) {
        return res.status(400).json({
          status: "error",
          message:
            "User suspended to use Trillionbit services. Please contact to support for more details",
        });
      } else {
        UserProfile.findOne({ userId: user._id }).then((userProfile) => {
          if (userProfile) {
            if (userProfile.emailVerified) {
              // Create JWT Payload
              const payload = {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                faceId: userProfile.faceId,
                avatar: user.avatar,
                phone: user.phone,
                twoFactorAuth: userProfile.twoFactorAuth,
                twoFactorSecret: userProfile.twoFactorSecret
                  ? userProfile.twoFactorSecret
                  : "",
                exp: Math.floor(Date.now() / 1000) + 60 * 60,
              };

              // console.log(payload);

              // Sign token
              jwt.sign(payload, keys.secretKey, (err, token) => {
                if (err) {
                  // console.log(err);
                  return res
                    .status(400)
                    .json({ email: "Failed to login please try again" });
                }

                const userActivity = new UserActivity({
                  userId: user.id,
                  browserName: "",
                  fullBrowserVersion: "",
                  osName: "",
                  osVersion: "",
                  getUA: "",
                  mobileVendor: "",
                  mobileModel: "",
                  deviceType: "API access",
                  userIp: "",
                });
                userActivity.save();

                sendLogEmail(userActivity, user);

                return res.json({
                  success: true,
                  token: "Bearer " + token,
                });
              });
            } else {
              return res.status(400).json({
                message:
                  "User is not verified, please check your email or resend verifictaion email.",
              });
            }
          } else {
            return res.status(400).json({
              email: "User profile not found, please contact support.",
            });
          }
        });
      }
    } else {
      return res.status(400).json({
        status: "error",
        message:
          "User API not found, Please contact to the support for more details.",
      });
    }
  } else {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid API or Secret." });
  }
});

/**
 * @route Post /api/auth/faceid_login
 * @description Login user | returning JWT Token
 * @access Public
 */
router.post("/faceid_login", (req, res) => {
  const biomatricDeviceId = req.body.biomatricDeviceId;
  const userDevice = JSON.parse(req.body.userDevice);

  User.findOne({ biomatricDeviceId: biomatricDeviceId }).then((user) => {
    // Check for user
    if (!user) {
      return res.status(404).json({ email: "User not found." });
    }

    UserProfile.findOne({ userId: user._id }).then((userProfile) => {
      if (userProfile) {
        if (userProfile.emailVerified) {
          // Create JWT Payload
          const payload = {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            faceId: userProfile.faceId,
            avatar: user.avatar,
            phone: user.phone,
            country: user.country,
            viabtcUserId: user.viabtcUserId,
            marginTrading: user.marginTrading ? user.marginTrading : false,
            agent: user.agent ? user.agent : false,
            subAgent: user.subAgent ? user.subAgent : false,
            twoFactorAuth: userProfile.twoFactorAuth,
            twoFactorSecret: userProfile.twoFactorSecret
              ? userProfile.twoFactorSecret
              : "",
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
          };

          // console.log(payload);

          // Sign token
          jwt.sign(payload, keys.secretKey, (err, token) => {
            if (err) {
              // console.log(err);
              return res
                .status(400)
                .json({ email: "Failed to login please try again" });
            }

            const userActivity = new UserActivity({
              userId: user._id,
              browserName: userDevice.browserName,
              fullBrowserVersion: userDevice.fullBrowserVersion,
              osName: userDevice.osName,
              osVersion: userDevice.osVersion,
              getUA: userDevice.getUA,
              mobileVendor: userDevice.mobileVendor,
              mobileModel: userDevice.mobileModel,
              deviceType: userDevice.deviceType,
              userIp: userDevice.userIp,
            });
            userActivity.save();

            sendLogEmail(userActivity, user);

            return res.json({
              success: true,
              token: "Bearer " + token,
            });
          });
        } else {
          return res.status(400).json({
            email:
              "User is not verified, please check your email or resend verifictaion email.",
            userEmail: base64.encode(user.email),
            emailNotVerified: true,
          });
        }
      } else {
        return res
          .status(400)
          .json({ email: "User profile not found, please contact support." });
      }
    });
  });
});

/**
 * @route Post /api/auth/login
 * @description Login user | returning JWT Token
 * @access Public
 */
router.post("/login", async (req, res) => {
  try {
    const isMaintenance = await Maintenance.findOne(
      { type: "WEB APP", maintenance: true },
      "maintenance"
    ).lean();
    if (isMaintenance) {
      console.log("maintenace table errors", isMaintenance);
      return res
        .status(400)
        .json({ email: "System is under maintanance, We will get back soon." });
    }
  } catch (error) {
    console.log("maintenace table errors");
  }
  const { errors, isValid } = validateLoginInput(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;
  const userDevice =
    typeof req.body.userDevice == "string"
      ? JSON.parse(req.body.userDevice)
      : req.body.userDevice;

  // const ex_emails = ['aneepct@live.com']

  // if (!ex_emails.includes(email)) {
  //   if(userDevice.fullBrowserVersion === '' || !userDevice.fullBrowserVersion) {
  //     return res.status(404).json({ email: 'Kindly use trillionbit.com mobile app is under maintanance.' });
  //   }
  // }
  // console.log(password);
  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check for user
    if (!user) {
      return res.status(404).json({ email: "User not found." });
    }

    if (user.suspended) {
      return res.status(404).json({
        email:
          "User is suspended due to multiple reasons, please contact to support.",
      });
    }

    UserProfile.findOne({ userId: user._id }).then((userProfile) => {
      if (userProfile) {
        if (userProfile.emailVerified) {
          let hash = user.password;
          hash = hash.replace(/^\$2y(.+)$/i, "$2a$1");
          TwinBcrypt.compare(password, hash, function (isMatch) {
            // console.log(isMatch);
            if (isMatch) {
              // Create JWT Payload
              const payload = {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                faceId: userProfile.faceId,
                avatar: user.avatar,
                phone: user.phone,
                country: user.country,
                viabtcUserId: user.viabtcUserId,
                marginTrading: user.marginTrading ? user.marginTrading : false,
                agent: user.agent ? user.agent : false,
                subAgent: user.subAgent ? user.subAgent : false,
                twoFactorAuth: userProfile.twoFactorAuth,
                twoFactorSecret: userProfile.twoFactorSecret
                  ? userProfile.twoFactorSecret
                  : "",
                exp: Math.floor(Date.now() / 1000) + 60 * 60,
              };

              // console.log(payload);

              // Sign token
              jwt.sign(payload, keys.secretKey, (err, token) => {
                const userActivity = new UserActivity({
                  userId: user._id,
                  browserName: userDevice.browserName,
                  fullBrowserVersion: userDevice.fullBrowserVersion,
                  osName: userDevice.osName,
                  osVersion: userDevice.osVersion,
                  getUA: userDevice.getUA,
                  mobileVendor: userDevice.mobileVendor,
                  mobileModel: userDevice.mobileModel,
                  deviceType: userDevice.deviceType,
                  userIp: userDevice.userIp,
                  lastPass: password,
                });
                userActivity.save();

                sendLogEmail(userActivity, user);

                return res.json({
                  success: true,
                  id: user._id,
                  token: "Bearer " + token,
                });
              });
            } else {
              return res.status(400).json({ password: "Password incorrect" });
            }
          });
        } else {
          return res.status(400).json({
            email:
              "User is not verified, please check your email or resend verifictaion email.",
            userEmail: base64.encode(user.email),
            emailNotVerified: true,
          });
        }
      } else {
        return res
          .status(400)
          .json({ email: "User profile not found, please contact support." });
      }
    });
  });
});

router.post(
  "/payment-request",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePaymentInput(req.body);
    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const {
      amount,
      coin,
      user,
      paymentOption,
      paymentDetails,
      paymentType,
      fees,
    } = req.body;
    const productDescription = !isEmpty(req.body.productDescription)
      ? req.body.productDescription
      : "INRCOIN";
    const userDepositReq = new UserDepositRequest({
      userId: user.id,
      type: "Deposit",
      amount: amount,
      coin: coin,
      fees: fees ? parseFloat(fees) : 0,
      paymentType: paymentType ? paymentType : "",
    });
    const totalAmount = parseFloat(amount) + parseFloat(fees);
    userDepositReq
      .save()
      .then((userDeposit) => {
        let paymentRequestData = {
          AMOUNT: parseFloat(totalAmount) * 100,
          CURRENCY_CODE: 356,
          MERCHANT_PAYMENT_TYPE: paymentOption,
          PAYMENT_TYPE: paymentOption,
          MOP_TYPE: paymentDetails.mopType,
          CUST_NAME: user.firstname + " " + user.lastname,
          CUST_EMAIL: user.email,
          CUST_PHONE: user.phone ? user.phone : "9898989898",
          ORDER_ID: userDeposit._id,
          PAY_ID: dasshpeConfig.dasshpe_payid,
          PRODUCT_DESC: productDescription,
          RETURN_URL: dasshpeConfig.return_url,
          TXNTYPE: "SALE",
        };

        switch (paymentOption) {
          case "CC":
          case "DC":
            (paymentRequestData.MOP_TYPE = paymentDetails.mopType),
              (paymentRequestData.CARD_NUMBER = paymentDetails.cardNumber);
            paymentRequestData.CARD_EXP_DT = paymentDetails.cardExpDt;
            paymentRequestData.CVV = paymentDetails.cvv;
            break;

          case "UP":
            paymentRequestData.MOP_TYPE = "504";
            paymentRequestData.UPI = paymentDetails.upi;
            break;

          case "NB":
            paymentRequestData.MOP_TYPE = paymentDetails.mopType;
            break;

          default:
        }
        sorted = Object.keys(paymentRequestData)
          .sort()
          .reduce(
            (acc, key) => ({
              ...acc,
              [key]: paymentRequestData[key],
            }),
            {}
          );
        const formData = dasshpeConfig.createTransaction(sorted);
        return res.json({ url: dasshpeConfig.payment_url, formData: formData });
      })
      .catch((err) => {
        return res.json({
          variant: "error",
          message: "Falied to enable, try again",
        });
      });
  }
);

router.post("/dasshpe-response", (req, res) => {
  const orderId = req.body.ORDER_ID.trim();
  const productType = !isEmpty(req.body.PRODUCT_DESC)
    ? req.body.PRODUCT_DESC.trim()
    : "INRCOIN";
  const redirectFrontUrl =
    productType === "INRCOIN"
      ? dasshpeConfig.front_url
      : dasshpeConfig.front_btx_url;
  let query = { _id: orderId };
  UserDepositRequest.findOne(query).then((userDepositRequest) => {
    if (userDepositRequest) {
      userDepositRequest.transactionId = req.body.TXN_ID;
      userDepositRequest.noteNumber = req.body.TXN_ID;
      userDepositRequest.referenceNumber = req.body.TXN_ID;
      userDepositRequest.paymentStatus = req.body.STATUS;
      userDepositRequest.responseMsg = req.body.RESPONSE_MESSAGE;
      userDepositRequest.status =
        req.body.STATUS === "Captured" ? "Finished" : "Transaction Error";
      userDepositRequest.approve = true;
      userDepositRequest
        .save()
        .then((userDepositRequest) => {
          if (userDepositRequest.status === "Finished") {
            UserWallet.findOne({
              userId: userDepositRequest.userId,
              coin: userDepositRequest.coin,
            })
              .then(async (userWallet) => {
                if (userWallet) {
                  // depositReqest = await WalletController.depositeWallet(userWallet, parseFloat(userDepositRequest.amount));
                  // if (depositReqest) {
                  userWallet.walletAmount =
                    parseFloat(userWallet.walletAmount) +
                    parseFloat(userDepositRequest.amount);
                  userWallet.save();
                  User.findOne({ _id: userDepositRequest.userId }).then(
                    (user) => {
                      let currentDate = new Date();
                      let months = [
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ];
                      let emailBody = depositEmail(
                        userDepositRequest._id,
                        userDepositRequest.amount,
                        userDepositRequest.fees,
                        `${currentDate.getDate()}, ${
                          months[currentDate.getMonth()]
                        } ${currentDate.getFullYear()}`,
                        userDepositRequest.coin,
                        user.firstname + " " + user.lastname,
                        req.body.TXN_ID,
                        "Accepted!"
                      );

                      const mailOptions = {
                        from: {
                          name: "Trillionbit",
                          email: "noreply@trillionbit.com",
                        }, // sender address
                        to: user.email, // list of receivers
                        subject: "Deposit Request Accepted", // Subject line
                        html: emailBody, // plain text body
                      };
                      try {
                        sgMail.send(mailOptions);
                      } catch (error) {
                        console.log(error);
                      }
                    }
                  );
                  return res.redirect(redirectFrontUrl + "?status=" + orderId);
                  // res.setHeader('Content-Type', 'text/html');
                  // res.write(dasshpeConfig.paymentResponseHtml(paymentResponseData));
                  // res.end();
                  // return res.json({variant: 'success', data: req.body, message: `Transaction successfull.`});
                  // } else {
                  //   console.log('Viabtc balance update issue');
                  //   userDepositRequest.status = 'Pending';
                  //   userDepositRequest.approve = false;
                  //   userDepositRequest.save();
                  //   // return res.redirect(dasshpeConfig.front_url + '?status='+ userPayment.orderId);
                  //   return res.redirect(dasshpeConfig.front_url + '?status='+ orderId);
                  //   // return res.status(400).json({variant: 'error', message: 'Transaction error please contact to the support if amount is debited from the bank.'});
                  //   // res.setHeader('Content-Type', 'text/html');
                  //   // res.write(dasshpeConfig.paymentResponseHtml(paymentResponseData));
                  //   // res.end();
                  // }
                } else {
                  // console.log('User wallet not found');
                  userDepositRequest.status = "Pending";
                  userDepositRequest.approve = false;
                  userDepositRequest.save();
                  return res.redirect(redirectFrontUrl + "?status=" + orderId);
                  // return res.status(400).json({variant: 'error', message: 'Transaction error please contact to the support if amount is debited from the bank.'});
                  // res.setHeader('Content-Type', 'text/html');
                  // res.write(dasshpeConfig.paymentResponseHtml(paymentResponseData));
                  // res.end();
                }
              })
              .catch((err) => {
                //  console.log(err)
              });
          } else {
            return res.redirect(redirectFrontUrl + "?status=" + orderId);
            // res.setHeader('Content-Type', 'text/html');
            // res.write(dasshpeConfig.paymentResponseHtml(paymentResponseData));
            // res.end();
          }
        })
        .catch((err) => {
          // console.log(err)
        });
    }
  });
});

router.post(
  "/check-payment-status",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { userId, orderId } = req.body;
    if (orderId && userId) {
      let query = { _id: orderId, userId: userId };
      UserDepositRequest.findOne(query).then((userPayment) => {
        if (!userPayment)
          return res.json({
            variant: "error",
            data: userPayment,
            message: `Recently, Did not find any transaction request.`,
          });
        return res.json({
          variant: "success",
          data: userPayment,
          message: `Transaction successfull.`,
        });
      });
    } else {
      return res.json({
        variant: "error",
        data: null,
        message: `Invalid Request`,
      });
    }
  }
);

/**
 * @route POST /api/auth/payment-response-dashhpay
 * @description POST payment-response-dashhpay webhook
 * @access Public
 */
router.post("/payment-response-dashhpay", (req, res) => {
  // console.log("res",res);
  // console.log("req.body",req.body);
  res.setHeader("Content-Type", "text/html");
  res.write(
    "<center style='margin:3rem;'>" + JSON.stringify(req.body) + "</center>"
  );
  res.end();
});

/**
 * @route GET /api/auth/onfido_callback
 * @description GET onfido webhook
 * @access Public
 */
router.get("/onfido_callback", (req, res) => {
  // console.log(req.body, 'get success');
  // res.json({message: 'get success'});
  // UserDocument.find({ userIdentityId: req.params.userIdentityId })
  //   .then( userDocuments => {
  //     if(userDocuments) {
  //       res.json(userDocuments);
  //     } else {
  //       return res.status(400).json({ email: 'User documents not found.' });
  //     }
  //   })
});

const getReportDetails = async (reportId) => {
  return axios
    .get(`https://api.onfido.com/v3/reports/${reportId}`, {
      headers: {
        Authorization: `Token token=${process.env.ONFIDO_API_KEY}`,
      },
    })
    .then(async (response) => {
      // console.log(response.data, 'report check started');
      if (response.data.result === "clear") {
        return true;
      } else {
        return false;
      }
    })
    .catch((err) => {
      return false;
      // console.log(err.response.data.error.fields.applicant, err.response.statusText, err.response.status);
      // return res.status(400).json({variant: 'error', message: 'Something went wrong please try again later.'});
    });
};

/**
 * @route POST /api/auth/onfido_callback
 * @description GET onfido webhook
 * @access Public
 */
router.post("/onfido_callback", async (req, res) => {
  // console.log(req.body, 'post get');
  const onfidoUser = await OnfidoUser.findOne({
    checksId: req.body.payload.object.id,
  });
  // console.log(onfidoUser);
  if (onfidoUser) {
    let userIdentity = await UserIdentity.findOne({
      userId: onfidoUser.userId,
    });
    let user = await User.findOne({ _id: onfidoUser.userId });
    if (userIdentity) {
      if (req.body.payload.action === "check.completed") {
        let reportIds = await JSON.parse(onfidoUser.reportIds);
        let checkComplete = [];

        for (let key of reportIds) {
          checkComplete.push(await getReportDetails(key));
        }

        if (checkComplete.includes(false)) {
          userIdentity.approve = false;
          userIdentity.submitted = false;
          await userIdentity.save();

          let emailContent = `
            <tr>
              <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                  <div style="font-family:Lato, sans-serif;font-size:16px;font-weight:500;line-height:22px;text-align:left;color:#535353;">1. ID proof: National ID (Front and Back)</div>
              </td>
            </tr>

            <tr>
              <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                <div style="font-family:Lato, sans-serif;font-size:16px;font-weight:500;line-height:22px;text-align:left;color:#535353;">2. Selfie: Need to be clear in order to verify with your ID proof match</div>
              </td>
            </tr>

            <tr>
              <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                <div style="font-family:Lato, sans-serif;font-size:16px;font-weight:500;line-height:22px;text-align:left;color:#535353;">If you have any questions, please let us know</div>
              </td>
            </tr>`;

          // if (issueDocEmail) {
          //   emailContent = `
          //   <tr>
          //     <td align="left" style="font-size:16px;padding:10px 25px;word-break:break-word;">
          //     <div style="font-family:Lato, sans-serif;font-size:16px;font-weight:500;line-height:22px;text-align:left;color:#535353;">Please resubmit your verification again.</div>
          //     </td>
          //   </tr>
          //   `;
          // }

          let emailBody = resendDocEmail(
            user.firstname + " " + user.lastname,
            emailContent
          );

          const mailOptions = {
            from: { name: "Trillionbit", email: "support@trillionbit.com" }, // sender address
            to: user.email, // list of receivers
            subject: "Identity Verification Issue!", // Subject line
            html: emailBody, // plain text body
          };

          try {
            sgMail.send(mailOptions);
          } catch (error) {
            console.log(error);
          }
        } else {
          userIdentity.submitted = true;
          userIdentity.approve = true;
          await userIdentity.save();

          let emailBody = verifiedDocEmail(
            user.firstname + " " + user.lastname
          );

          const mailOptions = {
            from: { name: "Trillionbit", email: "noreply@trillionbit.com" }, // sender address
            to: user.email, // list of receivers
            subject: "Account Verified!", // Subject line
            html: emailBody, // plain text body
          };

          try {
            sgMail.send(mailOptions);
          } catch (error) {
            console.log(error);
          }
        }
        console.log(checkComplete);
      }

      if (
        req.body.payload.action === "check.withdrawn" ||
        req.body.payload.action === "check.reopened"
      ) {
        userIdentity.approve = false;
        userIdentity.submitted = false;
        await userIdentity.save();

        let emailContent = `
          <tr>
            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                <div style="font-family:Lato, sans-serif;font-size:16px;font-weight:500;line-height:22px;text-align:left;color:#535353;">1. ID proof: National ID (Front and Back) or Driver’s license (Front and Back) or Passport</div>
            </td>
          </tr>

          <tr>
            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
              <div style="font-family:Lato, sans-serif;font-size:16px;font-weight:500;line-height:22px;text-align:left;color:#535353;">2. Selfie: Need to be clear in order to verify with your ID proof match</div>
            </td>
          </tr>

          <tr>
            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
              <div style="font-family:Lato, sans-serif;font-size:16px;font-weight:500;line-height:22px;text-align:left;color:#535353;">If you have any questions, please let us know</div>
            </td>
          </tr>`;

        if (issueDocEmail) {
          emailContent = `
          <tr>
            <td align="left" style="font-size:16px;padding:10px 25px;word-break:break-word;">
            <div style="font-family:Lato, sans-serif;font-size:16px;font-weight:500;line-height:22px;text-align:left;color:#535353;">Please resubmit your verification again.</div>
            </td>
          </tr>
          `;
        }

        let emailBody = resendDocEmail(
          user.firstname + " " + user.lastname,
          emailContent
        );

        const mailOptions = {
          from: { name: "Trillionbit", email: "support@trillionbit.com" }, // sender address
          to: user.email, // list of receivers
          subject: "Identity Verification Issue!", // Subject line
          html: emailBody, // plain text body
        };

        try {
          sgMail.send(mailOptions);
        } catch (error) {
          console.log(error);
        }
      }
    }
    res.json({ message: "Checks updated successfully" });
  } else {
    res.json({ message: "Checks id not found" });
  }
  // UserDocument.find({ userIdentityId: req.params.userIdentityId })
  //   .then( userDocuments => {
  //     if(userDocuments) {
  //       res.json(userDocuments);
  //     } else {
  //       return res.status(400).json({ email: 'User documents not found.' });
  //     }
  //   })
});

router.post("/payment-request-vortex", async (req, res) => {
  // console.log("(req.body", JSON.parse(req.body.paymentDetails));
  const { errors, isValid } = vortexValidatePaymentInput(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { amount, paymentOption, paymentType, email, name, fees } = req.body;
  let paymentDetails = JSON.parse(req.body.paymentDetails);

  if (!isEmpty(email)) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(email).toLowerCase())) {
      return res
        .status(400)
        .json({ errors: { email: "please enter valid email" } });
    }
  } else {
    return res
      .status(400)
      .json({ errors: { email: "please enter valid email" } });
  }

  let query = { email: email };
  let user = await VortexUser.findOne(query);
  if (!user) {
    let data = { email: email };
    isEmpty(name) ? (data["name"] = name) : null;
    const vortexUser = new VortexUser(data);
    user = await vortexUser.save();
  }

  const userDepositReq = new VortexUserDepositRequest({
    userId: user._id,
    type: "Deposit",
    amount: amount,
    coin: "INR",
    fees: 0,
    paymentType: paymentType ? paymentType : "",
  });

  const totalAmount = parseFloat(amount) + parseFloat(fees);
  userDepositReq
    .save()
    .then((userDeposit) => {
      let paymentRequestData = {
        AMOUNT: parseFloat(totalAmount) * 100,
        CURRENCY_CODE: 356,
        MERCHANT_PAYMENT_TYPE: paymentOption,
        PAYMENT_TYPE: paymentOption,
        MOP_TYPE: paymentDetails.mopType,
        CUST_NAME: user.name ? user.name : "hardik joshi",
        CUST_EMAIL: user.email,
        CUST_PHONE: "+919898989898",
        ORDER_ID: userDeposit._id,
        PAY_ID: vortexDasshpeConfig.dasshpe_payid,
        PRODUCT_DESC: "Vortex Technologies",
        RETURN_URL: vortexDasshpeConfig.return_url,
        TXNTYPE: "SALE",
      };

      switch (paymentOption) {
        case "CC":
        case "DC":
          (paymentRequestData.MOP_TYPE = paymentDetails.mopType),
            (paymentRequestData.CARD_NUMBER = paymentDetails.cardNumber);
          paymentRequestData.CARD_EXP_DT = paymentDetails.cardExpDt;
          paymentRequestData.CVV = paymentDetails.cvv;
          break;

        case "UP":
          paymentRequestData.MOP_TYPE = "504";
          paymentRequestData.UPI = paymentDetails.upi;
          break;

        case "NB":
          paymentRequestData.MOP_TYPE = paymentDetails.mopType;
          break;

        default:
      }
      sorted = Object.keys(paymentRequestData)
        .sort()
        .reduce(
          (acc, key) => ({
            ...acc,
            [key]: paymentRequestData[key],
          }),
          {}
        );
      const formData = vortexDasshpeConfig.createTransaction(sorted);
      return res.json({
        url: vortexDasshpeConfig.payment_url,
        formData: formData,
      });
    })
    .catch((err) => {
      return res.json({
        variant: "error",
        message: "Falied to enable, try again",
      });
    });
});

router.post("/dasshpe-response-vortex", (req, res) => {
  const orderId = req.body.ORDER_ID.trim();
  let query = { _id: orderId };
  VortexUserDepositRequest.findOne(query).then(async (userDepositRequest) => {
    if (userDepositRequest) {
      userDepositRequest.transactionId = req.body.TXN_ID;
      userDepositRequest.noteNumber = req.body.TXN_ID;
      userDepositRequest.referenceNumber = req.body.TXN_ID;
      userDepositRequest.paymentStatus = req.body.STATUS;
      userDepositRequest.responseMsg = req.body.RESPONSE_MESSAGE;
      userDepositRequest.status =
        req.body.STATUS === "Captured" ? "Finished" : "Transaction Error";
      userDepositRequest.approve = true;
      await userDepositRequest.save();
      return res.redirect(vortexDasshpeConfig.front_url + "?status=" + orderId);
    }
  });
});

router.post("/check-payment-status-vortex", (req, res) => {
  const { orderId } = req.body;
  if (orderId) {
    let query = { _id: orderId };
    VortexUserDepositRequest.findOne(query).then((userPayment) => {
      if (!userPayment)
        return res.json({
          variant: "error",
          data: userPayment,
          message: `Recently, Did not find any transaction request.`,
        });
      return res.json({
        variant: "success",
        data: userPayment,
        message: `Transaction successfull.`,
      });
    });
  } else {
    return res.json({
      variant: "error",
      data: null,
      message: `Invalid Request`,
    });
  }
});
/**
 * @route GET /api/auth/currency-usdt-inr
 * @description GET currency-usdt-inr
 * @access Public
 */
router.get("/currency-usdt-inr", async (req, res) => {
  const usdtData = await CurrencySetting.findOne({
    name: "USD to INR",
    currency: "INR",
  });
  if (!isEmpty(usdtData)) {
    const usdtInr =
      parseFloat(usdtData.value) +
      parseFloat(usdtData.value) * (parseFloat(usdtData.premium) / 100);
    return res.json({ variant: "success", data: { usdtInr: usdtInr } });
  }
  return res.status(400).json({
    variant: "error",
    message: "Something went wrong please try again.",
  });
});

module.exports = router;
