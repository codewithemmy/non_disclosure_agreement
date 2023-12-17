const {
  postDocusignController,
  getDocusignController,
  docusignWebhookController,
} = require("./docusign.controller")

const docusignRouter = require("express").Router()
const { isAuthenticated } = require("../../utils")
const { contentParser } = require("../../utils/contentParser")

docusignRouter
  .route("/restapi/v2.1/accounts/6a609554-d9d7-43d0-a0a6-24638588457b/connect")
  .post(docusignWebhookController)

//authenticated routes go below here
https: docusignRouter.use(isAuthenticated)

docusignRouter.route("/form/:uuid").post(postDocusignController)
docusignRouter.route("/form/:envelopeId").get(getDocusignController)

//routes
module.exports = docusignRouter
