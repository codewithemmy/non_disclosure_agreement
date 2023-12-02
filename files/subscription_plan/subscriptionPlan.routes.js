const subscriptionPlansRoute = require("express").Router()
const { checkSchema } = require("express-validator")
const { isAuthenticated, adminVerifier } = require("../../utils")
const { uploadManager } = require("../../utils/multer")
const {
  createSubscriptionPlans,
  fetchSubscriptionPlans,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
} = require("./subscriptionPlan.controller")

subscriptionPlansRoute.use(isAuthenticated)

subscriptionPlansRoute
  .route("/")
  .post(
    adminVerifier,
    uploadManager("image").single("serviceImage"),
    createSubscriptionPlans
  )
  .get(fetchSubscriptionPlans)

subscriptionPlansRoute.put(
  "/update/:id",
  adminVerifier,
  uploadManager("image").single("serviceImage"),
  updateSubscriptionPlan
)
subscriptionPlansRoute.delete("/delete/:id", deleteSubscriptionPlan)

module.exports = subscriptionPlansRoute
  