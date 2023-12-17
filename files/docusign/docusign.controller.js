const { BAD_REQUEST, SUCCESS } = require("../../constants/statusCode")
const { responseHandler } = require("../../core/response")
const { manageAsyncOps, fileModifier } = require("../../utils/index")
const { CustomError } = require("../../utils/errors")
const { DocusignService } = require("./docusign.service")
const crypto = require("crypto")

const validateHmac = (body, signature, secret) => {
  // Calculate the expected HMAC signature
  const calculatedSignature = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(body))
    .digest("hex")

  // Compare the calculated signature with the received signature
  return crypto.timingSafeEqual(
    Buffer.from(calculatedSignature, "hex"),
    Buffer.from(signature, "hex")
  )
}

const postDocusignController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    DocusignService.postDocusignService(req, res.locals.jwt._id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const getDocusignController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    DocusignService.getDocusignService(req)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

// const docusignWebhookController = async (req, res, next) => {

//   console.log('request', request)
//   try {
//     // Process the webhook asynchronously
//     const [error, data] = await manageAsyncOps(
//       DocusignService.docusignWebhookService(req)
//     )
//     // Send a success response
//     res.sendStatus(200)
//   } catch (err) {
//     console.error("Error in Docusign Webhook Controller:", err)
//     res.status(500).send("Internal Server Error")
//   }
// }

const docusignWebhookController = async (req, res, next) => {
  console.log("request", req.bodys)
  try {
    // Verify payload integrity
    const receivedSignature = req.headers["x-docusign-signature"]
    const isHmacValid = validateHmac(
      req.body,
      receivedSignature,
      process.env.DOCUSIGN_WEBHOOK_SECRET
    )

    if (!isHmacValid) {
      throw new Error("Invalid Docusign signature")
    }

    // Process the webhook asynchronously
    const [error, data] = await manageAsyncOps(
      DocusignService.docusignWebhookService(req)
    )

    if (error) {
      console.error("Error processing DocuSign webhook:", error)
      throw error // Rethrow the error for proper handling
    }

    // Set the Content-Type header to application/json
    res.setHeader("Content-Type", "application/json")

    // Send a JSON success response
    res.json({ success: true })
  } catch (err) {
    console.error("Error in Docusign Webhook Controller:", err)
    res.status(500).json({ error: "Internal Server Error" })
  }
}

// const docusignWebhookController = async (req, res, next) => {
//   console.log("request", req)
//   // Log the response body
//   console.log("Response Body:", JSON.stringify({ success: true }))
//   try {
//     // Process the webhook asynchronously
//     const [error, data] = await manageAsyncOps(
//       DocusignService.docusignWebhookService(req)
//     )

//     if (error) {
//       console.error("Error processing DocuSign webhook:", error)
//       throw error // Rethrow the error for proper handling
//     }

//     // Set the Content-Type header to application/json
//     res.setHeader("Content-Type", "application/json")

//     // Send a JSON success response
//     res.status(200).json({ success: true })
//   } catch (err) {
//     console.error("Error in Docusign Webhook Controller:", err)
//     res.status(500).json({ error: "Internal Server Error" })
//   }
// }

module.exports = {
  postDocusignController,
  getDocusignController,
  docusignWebhookController,
}
