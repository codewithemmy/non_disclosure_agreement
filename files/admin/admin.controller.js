const { manageAsyncOps, fileModifier } = require("../../utils/index")
const { AdminAuthService } = require("./admin.service")
const { responseHandler } = require("../../core/response")
const { CustomError } = require("../../utils/errors")

const adminSignUpController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    AdminAuthService.adminSignUpService(req, res.locals.jwt)
  )

  if (error) return next(error)

  if (!data?.success) return next(new CustomError(data.msg, 400, data))

  return responseHandler(res, 200, data)
}

const adminLogin = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    AdminAuthService.adminLoginService(req.body)
  )

  if (error) return next(error)

  if (!data?.success) return next(new CustomError(data.msg, 401, data))

  return responseHandler(res, 200, data)
}

const getAdminController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    AdminAuthService.getAdminService(req.query)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, 400, data))

  return responseHandler(res, 200, data)
}

const getLoggedInAdminController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    AdminAuthService.getLoggedInAdminService(res.locals.jwt)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, 400, data))

  return responseHandler(res, 200, data)
}

const updateAdminController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    AdminAuthService.updateAdminService(req)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, 400, data))

  return responseHandler(res, 200, data)
}

const changeAdminPasswordController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    AdminAuthService.changePassword(req.body)
  )
  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, 400, data))

  return responseHandler(res, 200, data)
}

const imageUpload = async (req, res, next) => {
  let value = await fileModifier(req)

  const [error, data] = await manageAsyncOps(
    AdminAuthService.uploadImageService(value, res.locals.jwt)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, 400, data))

  return responseHandler(res, 200, data)
}

module.exports = {
  adminSignUpController,
  adminLogin,
  updateAdminController,
  changeAdminPasswordController,
  imageUpload,
  getAdminController,
  getLoggedInAdminController,
}
