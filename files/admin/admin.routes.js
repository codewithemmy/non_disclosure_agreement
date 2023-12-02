const adminRoute = require("express").Router()
const { checkSchema } = require("express-validator")
const { isAuthenticated, adminVerifier } = require("../../utils/index")
const { uploadManager } = require("../../utils/multer")
const { validate } = require("../../validations/validate")

const {
  adminSignUpController,
  adminLogin,
  getAdminController,
  updateAdminController,
  getLoggedInAdminController,
} = require("./admin.controller")
const { createAdminValidator } = require("../../validations/admin/admin")
const {
  loginAdminValidation,
} = require("../../validations/admin/loginAdminValidation")

//admin route
adminRoute
  .route("/login")
  .post(validate(checkSchema(loginAdminValidation)), adminLogin)

adminRoute.use(isAuthenticated)

adminRoute
  .route("/")
  .post(
    validate(checkSchema(createAdminValidator)),
    adminVerifier,
    adminSignUpController
  )

adminRoute.route("/profile").get(getAdminController)
adminRoute.route("/logged-in").get(getLoggedInAdminController)

//update admin
adminRoute.route("/update/:id").patch(updateAdminController)
module.exports = adminRoute
