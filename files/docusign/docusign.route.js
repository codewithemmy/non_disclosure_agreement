const {
  postDocusignController,
  getDocusignController,
} = require("./docusign.controller")

const docusignRouter = require("express").Router()

const { isAuthenticated, adminVerifier } = require("../../utils")

//authenticated routes go below here
docusignRouter.use(isAuthenticated)

docusignRouter.route("/form/:uuid").post(postDocusignController)
docusignRouter.route("/form/:envelopeId").get(getDocusignController)

//routes
module.exports = docusignRouter
