const contractRoute = require("express").Router()
const { checkSchema } = require("express-validator")
const { validate } = require("../../validations/validate")
const {
  uploadManager,
  uploadFileManager,
  videoManager,
} = require("../../utils/multer")

const { isAuthenticated, adminVerifier } = require("../../utils")
const {
  fetchContractController,
  fetchContractFilesController,
  createContractController,
} = require("./contract.controller")

//authenticated routes go below here
contractRoute.use(isAuthenticated)


//routes
contractRoute
  .route("/")
  .post(adminVerifier, createContractController)
  .get(fetchContractController)

//routes
module.exports = contractRoute
