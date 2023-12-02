const onRequestOTP = async (otp, toPhoneNumber) => {
  const accountSid = "AC146bd600690d5142690bb28c43027195"
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const client = require("twilio")(accountSid, authToken)

  const response = await client.messages.create({
    body: `Your OTP is ${otp}`,
    from: "+13613458047",
    to: `${toPhoneNumber}`,
  })

  return response
}

module.exports = { onRequestOTP }
