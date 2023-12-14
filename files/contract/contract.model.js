const mongoose = require("mongoose")

const contractSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    contractName: {
      type: String,
    },
    totalPrice: {
      type: String,
    },
    fileName: {
      type: String,
    },
    contractId: {
      type: String,
    },
    uniqueId: {
      type: String,
    },
    invoice: {
      type: String,
    },
    clientId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contractPlan: {
      type: mongoose.Types.ObjectId,
      ref: "SubscriptionPlan",
    },
    transactionId: {
      type: mongoose.Types.ObjectId,
      ref: "Transaction",
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    dateOfDelivery: { type: Date, default: null },
    selectedTire: { type: String },
    status: {
      type: String,
      enum: ["signed", "active", "not-signed", "inactive", "pending"],
      default: "not-signed",
    },
  },
  { timestamps: true }
)

const contract = mongoose.model("Contract", contractSchema, "contract")

module.exports = { Contract: contract }
