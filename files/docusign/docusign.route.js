const {
  postDocusignController,
  getDocusignController,
  docusignWebhookController,
} = require("./docusign.controller")

const docusignRouter = require("express").Router()

docusignRouter.route("/docusign/webhook").get(docusignWebhookController)

const { isAuthenticated } = require("../../utils")

//authenticated routes go below here
docusignRouter.use(isAuthenticated)

docusignRouter.route("/form/:uuid").post(postDocusignController)
docusignRouter.route("/form/:envelopeId").get(getDocusignController)

//routes
module.exports = docusignRouter
