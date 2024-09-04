const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserProfileSchema = new Schema({
  userId: {
    type: String,
    require: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationCode: {
    type: Number,
    require: false,
  },
  phoneVerified: {
    type: Boolean,
    default: false,
  },
  phoneVerificationCode: {
    type: Number,
    require: false,
  },
  monthlyVolume: {
    type: Number,
    default: 0,
  },
  traderLevel: {
    type: String,
    default: 1,
  },
  twoFactorSecret: {
    type: String,
    require: false,
  },
  twoFactorAuth: {
    type: Boolean,
    default: false,
  },
  faceId: {
    type: Boolean,
    default: false,
  },
  profileComplete: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = UserProfile = mongoose.model(
  "userProfiles",
  UserProfileSchema
);
