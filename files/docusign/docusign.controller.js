const { BAD_REQUEST, SUCCESS } = require("../../constants/statusCode")
const { responseHandler } = require("../../core/response")
const { manageAsyncOps, fileModifier } = require("../../utils/index")
const { CustomError } = require("../../utils/errors")
const { DocusignService } = require("./docusign.service")
const crypto = require("crypto")

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

const docusignWebhookController = async (req, res, next) => {
  try {
    // Verify payload integrity
    const hash = crypto
      .createHmac("sha512", process.env.DOCUSIGN_WEBHOOK_SECRET)
      .update(JSON.stringify(req.body))
      .digest("hex")

    if (hash !== req.headers["x-docusign-signature"]) {
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

    // Send a success response
    res.sendStatus(200)
  } catch (err) {
    console.error("Error in Docusign Webhook Controller:", err)
    res.status(500).send("Internal Server Error")
  }
}

module.exports = {
  postDocusignController,
  getDocusignController,
  docusignWebhookController,
}
