const mongoose = require("mongoose")

const subscriptionPlanSchema = new mongoose.Schema({
  title: String,
  subTitle: String,
  description: String,
  serviceImage: String,
  service: {
    type: String,
  },
  availablePlans: {
    basic: {
      title: String,
      subTitle: String,
      name: String,
      cost: Number,
      priceId: String,
      deliveryTime: Number,
      numberOfRevisions: String,
      numberOfPages: Number,
      designCustomization: Boolean,
      contentUpload: Boolean,
      responsiveDesign: Boolean,
      includeSourceCode: Boolean,
    },
    pro: {
      title: String,
      subTitle: String,
      name: String,
      cost: Number,
      priceId: String,
      deliveryTime: Number,
      numberOfRevisions: String,
      numberOfPages: Number,
      designCustomization: Boolean,
      contentUpload: Boolean,
      responsiveDesign: Boolean,
      includeSourceCode: Boolean,
    },
    max: {
      title: String,
      subTitle: String,
      name: String,
      cost: Number,
      priceId: String,
      deliveryTime: Number,
      numberOfRevisions: String,
      numberOfPages: Number,
      designCustomization: Boolean,
      contentUpload: Boolean,
      responsiveDesign: Boolean,
      includeSourceCode: Boolean,
    },
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },
})

const subscriptionPlan = mongoose.model(
  "SubscriptionPlan",
  subscriptionPlanSchema,
  "subscriptionPlan"
)

module.exports = { SubscriptionPlan: subscriptionPlan }
