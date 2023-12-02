const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    tokenIsNew: {
      type: Boolean,
      default: true,
    },
    tokenCountUsed: {
      type: Number,
      default: 0,
    },
    email: {
      type: String,
      unique: true,
    },
    stripeCustomerId: {
      type: String,
    },
    password: { type: String },
    photo: { type: String },
    accountType: {
      type: String,
      required: true,
      enum: ["User"],
      default: "User",
    },
    alternateEmail: {
      type: String,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    passwordToken: {
      type: String,
    },
    verificationOtp: {
      type: String,
    },
    passwordTokenExpirationDate: {
      type: Date,
    },
    verified: { type: Date, default: Date.now() },
  },
  { timestamps: true }
)

const user = mongoose.model("User", userSchema, "user")

module.exports = { User: user }
