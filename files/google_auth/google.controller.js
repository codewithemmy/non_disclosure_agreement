require("../../utils/passport")
const { SUCCESS, BAD_REQUEST } = require("../../constants/statusCode")
const { responseHandler } = require("../../core/response")
const { manageAsyncOps } = require("../../utils")
const { CustomError } = require("../../utils/errors")
const GoogleAuthService = require("./google.service")

const googleSuccessController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    GoogleAuthService.googleSuccessService(req.user)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const googleFailureController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    GoogleAuthService.googleFailureService()
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

module.exports = {
  googleSuccessController,
  googleFailureController,
}
