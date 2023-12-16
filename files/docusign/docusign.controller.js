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
  console.log("error", error)

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
  const hash = crypto
    .createHmac("sha512", process.env.DOCUSIGN_WEBHOOK)
    .update(JSON.stringify(req.body))
    .digest("hex")

  if (hash == req.headers["x-docusign-signature-"]) {
    const [error, data] = await manageAsyncOps(
      DocusignService.docusignWebhookService(req)
    )

    res.sendStatus(200)
  }
}

module.exports = {
  postDocusignController,
  getDocusignController,
  docusignWebhookController,
}
