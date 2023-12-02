const userRoute = require("../files/user/user.route")
const authRoute = require("../files/auth/auth.route")
const adminRoute = require("../files/admin/admin.routes")
const contractRoute = require("../files/contract/contract.route")
const docusignRouter = require("../files/docusign/docusign.route")
const googleRoute = require("../files/google_auth/google.route")

const routes = (app) => {
  const base_url = "/api/v1"

  app.use(`${base_url}/user`, userRoute)
  app.use(`${base_url}/auth`, authRoute)
  app.use(`${base_url}/admin`, adminRoute)
  app.use(`${base_url}/contract`, contractRoute)
  app.use(`${base_url}/docusign`, docusignRouter)
  app.use("", googleRoute)
}

module.exports = routes
