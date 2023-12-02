const { application, app } = require("./app")
const dotenv = require("dotenv")
const path = require("path")
const connectToDatabase = require("./db")
const { config } = require("./config")

dotenv.config({ path: path.join(__dirname, "../.env") })


const port = config.PORT || 5000

const startServer = () => {
  application()
  connectToDatabase()

  app.listen(port, () => {
    console.log(`Application running on port ${port}`)
  })

  // Handle unhandled promise rejections and exceptions
  process.on("unhandledRejection", (err) => {
    console.log(err.message)
    process.exit(1)
  })

  process.on("uncaughtException", (err) => {
    console.log(err.message)
    process.exit(1)
  })
}

module.exports = startServer
