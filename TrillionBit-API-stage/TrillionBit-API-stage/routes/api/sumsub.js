const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const SumsubUser = require("../../models/sumsub/SumsubUser");
const UserIdentity = require("../../models/UserIdentity");
const router = express.Router();
const SUMSUB_WEBHOOK_SECRET = process.env.SUMSUB_WEBHOOK_SECRET;

// Middleware to capture raw body
const captureRawBody = (req, res, buf, encoding) => {
  req.rawBody = buf.toString(encoding || "utf8");
};

const rawBodyMiddleware = bodyParser.json({ verify: captureRawBody });

router.post("/webhook", rawBodyMiddleware, async (req, res) => {
  const algo = "sha256";
  if (!req.rawBody) {
    return res.status(400).send("Raw body not available");
  }

  const calculatedDigest = crypto
    .createHmac(algo, SUMSUB_WEBHOOK_SECRET)
    .update(req.rawBody)
    .digest("hex");

  if (calculatedDigest !== req.headers["x-payload-digest"]) {
    return res.status(401).send("Invalid signature");
  }

  // Handle the webhook payload
  const payload = req.body;
  const {
    applicantId,
    type,
    reviewResult,
    inspectionId,
    levelName,
    externalUserId, // This might be the userId we need
    createdAtMs,
    clientId,
  } = payload;

  const updateData = {
    reviewResult: {
      reviewAnswer: reviewResult?.reviewAnswer,
      rejectLabels: reviewResult?.rejectLabels,
      reviewRejectType: reviewResult?.reviewRejectType,
    },
    inspectionId,
    levelName,
    externalUserId,
    clientId,
    date: new Date(parseInt(createdAtMs)), // Converts timestamp to Date object
  };

  const userIdentityUpdateData = {};

  switch (type) {
    case "applicantCreated":
    case "applicantPending":
      userIdentityUpdateData.submitted = true;
      break;
    case "applicantReviewed":
    case "applicantOnHold":
    case "applicantActionReviewed":
    case "applicantActionOnHold":
      userIdentityUpdateData.approve = reviewResult?.reviewAnswer === "GREEN";
      userIdentityUpdateData.onHold = reviewResult?.reviewAnswer === "RED";
      break;
    default:
      console.log(`Unhandled webhook type: ${type}`);
      return res.status(400).send(`Unhandled webhook type: ${type}`);
  }

  try {
    // Update SumsubUser with all available information
    await SumsubUser.findOneAndUpdate(
      { applicantId },
      { $set: updateData },
      { new: true, upsert: true }
    );

    // Logging to ensure correct data is received
    console.log(`UpdateData: ${JSON.stringify(updateData)}`);
    console.log(
      `UserIdentityUpdateData: ${JSON.stringify(userIdentityUpdateData)}`
    );

    // Update UserIdentity if needed
    if (Object.keys(userIdentityUpdateData).length > 0) {
      const userIdentity = await UserIdentity.findOneAndUpdate(
        { userId: externalUserId }, // Assuming `externalUserId` in payload corresponds to `userId` in UserIdentity
        { $set: userIdentityUpdateData },
        { new: true, upsert: true }
      );

      // Additional logging to debug the issue
      if (userIdentity) {
        console.log(`UserIdentity updated: ${JSON.stringify(userIdentity)}`);
      } else {
        console.log(`UserIdentity not found for userId: ${externalUserId}`);
      }
    }

    console.log(`${type} webhook processed for applicantId: ${applicantId}`);
    res.status(200).send(`${type} webhook received and processed`);
  } catch (err) {
    console.error(`Error processing ${type} webhook:`, err);
    res.status(500).send(`Error processing ${type} webhook`);
  }
});

module.exports = router;
