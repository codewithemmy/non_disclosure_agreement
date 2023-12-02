const { BAD_REQUEST, SUCCESS } = require("../../constants/statusCode")
const { responseHandler } = require("../../core/response")
const { manageAsyncOps, fileModifier } = require("../../utils/index")
const { CustomError } = require("../../utils/errors")
const { DocusignService } = require("./docusign.service")

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

module.exports = {
  postDocusignController,
  getDocusignController,
}
