const { checkSchema } = require("express-validator")
const userRoute = require("express").Router()
const { isAuthenticated, adminVerifier } = require("../../utils")
const { validate } = require("../../validations/validate")

//controller files
const {
  createUserController,
  userLoginController,
} = require("../user/controllers/user.controller")
const {
  updateUserProfileController,
  getUserProfileController,
  deleteUserProfileController,
  changePasswordController,
  getUserController,
  NDAGeneratorController,
  saveNdaController,
  downloadNdaController,
} = require("./controllers/profile.controller")
const {
  createUserValidation,
} = require("../../validations/users/createUser.validation copy")
const { loginValidation } = require("../../validations/users/login.validation")

//routes
userRoute
  .route("/")
  .post(validate(checkSchema(createUserValidation)), createUserController)

userRoute
  .route("/login")
  .post(validate(checkSchema(loginValidation)), userLoginController)

userRoute.route("/").get(getUserController)


userRoute.route("/download-nda/:uuid").get(downloadNdaController)

userRoute.use(isAuthenticated)

userRoute.patch("/update", updateUserProfileController)

userRoute.route("/logged-in").get(getUserProfileController)
userRoute.route("/delete").patch(deleteUserProfileController)

//reset password route
userRoute.route("/password").patch(changePasswordController)

//NDA Generator route
userRoute.route("/generate").post(NDAGeneratorController)

userRoute.route("/save-nda").post(saveNdaController)

module.exports = userRoute
