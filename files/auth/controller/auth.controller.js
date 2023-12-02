const { SUCCESS, BAD_REQUEST } = require("../../../constants/statusCode")
const { responseHandler } = require("../../../core/response")
const { manageAsyncOps } = require("../../../utils")
const { CustomError } = require("../../../utils/errors")
const AuthService = require("../auth.service")

const verifyUserController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    AuthService.verifyUser({ body: req.body })
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const forgotPasswordController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    AuthService.forgotPassword(req.body)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}
const resetPasswordController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    AuthService.resetPassword(req.body)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const verifyOtpController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    AuthService.verifyOtpService(req.body)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

module.exports = {
  verifyUserController,
  forgotPasswordController,
  resetPasswordController,
  verifyOtpController,
}
