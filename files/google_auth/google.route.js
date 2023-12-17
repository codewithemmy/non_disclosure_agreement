const googleRoute = require("express").Router()
require("../../utils/passport")
const passport = require("passport")
const {
  googleSuccessController,
  googleFailureController,
} = require("./google.controller")
const { docusignWebhookController } = require("../docusign/docusign.controller")

//routes
googleRoute.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
)
googleRoute.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/google/success",
    failureRedirect: "/auth/google/failure",
  })
)
googleRoute.get("/auth/google/success", googleSuccessController)
googleRoute.get("/auth/google/failure", googleFailureController)

googleRoute.post(
  "/restapi/v2.1/accounts/6a609554-d9d7-43d0-a0a6-24638588457b/connect",
  docusignWebhookController
)

module.exports = googleRoute
