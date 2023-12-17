const {
  postDocusignController,
  getDocusignController,
  docusignWebhookController,
} = require("./docusign.controller")

const docusignRouter = require("express").Router()
const { isAuthenticated } = require("../../utils")
const { contentParser } = require("../../utils/contentParser")

docusignRouter.route("/webhook").post(docusignWebhookController)

//authenticated routes go below here
docusignRouter.use(isAuthenticated)

docusignRouter.route("/form/:uuid").post(postDocusignController)
docusignRouter.route("/form/:envelopeId").get(getDocusignController)

//routes
module.exports = docusignRouter
