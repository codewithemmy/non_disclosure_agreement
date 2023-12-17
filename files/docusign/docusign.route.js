const {
  postDocusignController,
  getDocusignController,
} = require("./docusign.controller")

const docusignRouter = require("express").Router()
const { isAuthenticated } = require("../../utils")

//authenticated routes go below here
https: docusignRouter.use(isAuthenticated)

docusignRouter.route("/form/:uuid").post(postDocusignController)
docusignRouter.route("/form/:envelopeId").get(getDocusignController)

//routes
module.exports = docusignRouter
