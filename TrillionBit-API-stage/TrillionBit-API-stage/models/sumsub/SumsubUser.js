const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const SumsubUserSchema = new Schema({
  userId: {
    type: String,
    required: true, // Ensure this is required as per your business logic, might be externalUserId
  },
  applicantId: {
    type: String,
    required: true,
  },
  inspectionId: {
    type: String,
    required: false,
  },
  reviewResult: {
    reviewAnswer: { type: String, required: false }, // Assuming structure of reviewResult
    rejectLabels: { type: [String], required: false },
    reviewRejectType: { type: String, required: false },
  },
  levelName: {
    type: String,
    required: false,
  },
  externalUserId: {
    type: String,
    required: false,
  },
  clientId: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = SumsubUser = mongoose.model("sumsubUsers", SumsubUserSchema);
