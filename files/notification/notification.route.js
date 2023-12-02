const notificationRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")

notificationRoute.use(isAuthenticated)

const {
  fetchNotifications,
  postNotifications,
} = require("./notification.controller")

//route
notificationRoute.route("/").get(fetchNotifications).post(postNotifications)

module.exports = notificationRoute
