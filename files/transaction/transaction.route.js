const transactionRoute = require("express").Router()
const { checkSchema } = require("express-validator")
const { isAuthenticated } = require("../../utils")

const {
  getTransactionController,
  checkoutTransactionController,
  retrieveTransactionController,
} = require("./controller/transaction.controller")

transactionRoute.get("/", getTransactionController)
transactionRoute.post("/checkout", checkoutTransactionController)
transactionRoute.get("/verify", retrieveTransactionController)

//routes
module.exports = transactionRoute
