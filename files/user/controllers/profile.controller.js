const { BAD_REQUEST, SUCCESS } = require("../../../constants/statusCode")
const { responseHandler } = require("../../../core/response")
const { manageAsyncOps, fileModifier } = require("../../../utils")
const { CustomError } = require("../../../utils/errors")
const path = require("path")
const { uploadManager, uploadImageManager } = require("../../../utils/multer")
const { ndaService } = require("../services/ndaGenerator.service")
const { ProfileService } = require("../services/profile.service")
const { UserService } = require("../services/user.service")

const getUserController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ProfileService.getUserService(req.query, res.locals.jwt)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const updateUserController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ProfileService.UpdateUserService(req.body, res.locals.jwt)
  )
  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const changePasswordController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ProfileService.changePasswordService(req.body, res.locals.jwt)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const getUserProfileController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ProfileService.getUserProfileService(res.locals.jwt._id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const updateUserProfileController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ProfileService.updateProfileService(res.locals.jwt._id, req)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, 200, data)
}

const deleteUserProfileController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ProfileService.deleteProfileService(res.locals.jwt._id, req.body)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, 200, data)
}

const NDAGeneratorController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ndaService.NDAGeneratorService(req, res.locals.jwt)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const saveNdaController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    ndaService.saveNdaService(req, res.locals.jwt._id)
  )
 
  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const downloadNdaController = async (req, res, next) => {
  try {
    const fileName = `${req.params.uuid}_document.pdf`
    const filePath = path.join(__dirname, "../../../utils/public/pdf/", fileName)

    // Set the appropriate content type for a PDF file
    res.setHeader("Content-Type", "application/pdf")
    // Set the content disposition to trigger a download
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=downloaded-file.pdf"
    )

    return res.download(filePath)
  } catch (error) {
    console.log("error", error)
    return next(error)
  }
}

module.exports = {
  getUserController,
  updateUserController,
  changePasswordController,
  getUserProfileController,
  updateUserProfileController,
  deleteUserProfileController,
  NDAGeneratorController,
  saveNdaController,
  downloadNdaController,
}
