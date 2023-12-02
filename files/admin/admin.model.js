const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    image: { type: String },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    action: {
      type: String,
      enum: ["Activate", "Deactivate"],
      default: "Deactivate",
    },
    accountType: {
      type: String,
      enum: ["superAdmin", "normalAdmin"],
      default: "superAdmin",
    },
    userType: {
      type: String,
      enum: ["Admin"],
      default: "Admin",
    },
    avatar: String,
  },
  { timestamps: true }
)

const admin = mongoose.model("Admin", adminSchema, "admin")

module.exports = { Admin: admin }
