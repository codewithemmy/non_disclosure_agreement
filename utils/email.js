const nodemailer = require("nodemailer")
const handlebars = require("handlebars")
const fs = require("fs")
const path = require("path")
const { AuthSuccess, AuthFailure } = require("../files/auth/auth.messages")
handlebars.registerHelper("eq", (a, b) => a == b)

const mailTransport = nodemailer.createTransport({
  host: process.env.SMS_HOST,
  port: process.env.SMS_PORT,
  secure: true, // use TLS
  auth: {
    user: process.env.SMS_USER,
    pass: process.env.SMS_PASS,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
})

mailTransport.verify(function (error, success) {
  if (error) {
    console.log(error)
  } else {
    console.log("Server is ready to take our messages")
  }
})

const sendMailNotification = async (
  to_email,
  subject,
  substitutional_parameters,
  Template_Name
) => {
  const source = fs.readFileSync(
    path.join(__dirname, `../templates/${Template_Name}.hbs`),
    "utf8"
  )

  const compiledTemplate = handlebars.compile(source)

  await mailTransport.sendMail({
    from: '"Non-Disclosure" <nda@gmail.com>', // sender address
    to: to_email, // list of receivers
    subject: subject, // Subject line
    html: compiledTemplate(substitutional_parameters),
  })
}

module.exports = { sendMailNotification }
