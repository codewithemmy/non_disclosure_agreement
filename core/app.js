const { handleApplicationErrors, notFound } = require("./response")

const express = require("express")
const fileUpload = require("express-fileupload")
const cors = require("cors")
const xss = require("xss-clean")
const helmet = require("helmet")
const compression = require("compression")
const mongoSanitize = require("express-mongo-sanitize")
const emailValidation = require("./emailCheck")
const routes = require("./routes")
const session = require("express-session")
const passport = require("passport")

const app = express()
const application = () => {
  app.use(express.static("public"))
  app.use(
    session({
      secret: process.env.SESSION_ID,
      resave: true,
      saveUninitialized: true,
      cookie: { secure: false },
    })
  )
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(express.text())
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(helmet())
  app.use(xss())
  app.use(mongoSanitize())
  app.use(compression())
  app.use(cors())
  app.use(emailValidation)
  app.use(fileUpload({ useTempFiles: true }))

  app.use((req, res, next) => {
    next()
  })

  app.get("/", (req, res) => {
    res.status(200).json({ message: "NDA project is working fine" })
  })

  routes(app)
  app.use(handleApplicationErrors) //application errors handler
  app.use(notFound)
}

module.exports = { app, application }
