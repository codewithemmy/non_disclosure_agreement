const mongoose = require("mongoose")
const { AdminRepository } = require("./admin.repository")
const {
  hashPassword,
  verifyPassword,
  tokenHandler,
  queryConstructor,
} = require("../../utils/index")
const { authMessages } = require("./messages/auth.messages")
const { adminMessages } = require("./messages/admin.messages")
const { uploadImageManager } = require("../../utils/multer")

class AdminAuthService {
  static async adminSignUpService(data, locals) {
    const { body } = data
    if (!data.files || !data.files.image)
      return { success: false, msg: adminMessages.UPDATE_IMAGE_FAILURE }

    const image = await uploadImageManager(data)
    if (locals.accountType != "superAdmin") {
      return { success: false, msg: authMessages.SUPER_ADMIN }
    }
    const admin = await AdminRepository.fetchAdmin({
      email: body.email,
    })

    if (admin) {
      return { success: false, msg: authMessages.ADMIN_EXISTS }
    }

    const password = await hashPassword(body.password)
    const signUp = await AdminRepository.create({
      ...body,
      image: image.secure_url,
      password,
    })

    return { success: true, msg: authMessages.ADMIN_CREATED, data: signUp }
  }

  static async adminLoginService(body) {
    const { email, password } = body
    const admin = await AdminRepository.fetchAdmin({
      email: email,
    })

    if (!admin) {
      return {
        success: false,
        msg: authMessages.LOGIN_ERROR,
      }
    }

    const passwordCheck = await verifyPassword(password, admin.password)

    if (!passwordCheck) {
      return { success: false, msg: authMessages.INCORRECT_PASSWORD }
    }

    admin.password = undefined

    const token = await tokenHandler({
      _id: admin._id,
      fullName: admin.fullName,
      email: admin.email,
      status: admin.status,
      action: admin.action,
      accountType: admin.accountType,
      userType: admin.userType,
      isAdmin: true,
    })

    const adminDetails = {
      _id: admin._id,
      fullName: admin.fullName,
      email: admin.email,
      accountType: admin.accountType,
      status: admin.status,
      userType: admin.userType,
      ...token,
    }
    return {
      success: true,
      msg: authMessages.ADMIN_FOUND,
      data: adminDetails,
    }
  }

  static async getAdminService(userPayload) {
    const { error, params, limit, skip, sort } = queryConstructor(
      userPayload,
      "createdAt",
      "Admin"
    )
    if (error) return { SUCCESS: false, msg: error }

    const getAdmin = await AdminRepository.findAdminParams({
      ...params,
      limit,
      skip,
      sort,
    })

    if (getAdmin.length < 1)
      return { success: false, msg: authMessages.ADMIN_NOT_FOUND }

    getAdmin.password = undefined
    return { success: true, msg: authMessages.ADMIN_FOUND, data: getAdmin }
  }

  static async updateAdminService(data) {
    const { body, params } = data

    const image = await uploadImageManager(data)

    delete body.email

    const admin = await AdminRepository.updateAdminById(params.id, {
      image: image.secure_url,
      ...body,
    })

    if (!admin) {
      return {
        success: false,
        msg: adminMessages.UPDATE_PROFILE_FAILURE,
      }
    } else {
      return {
        success: true,
        msg: adminMessages.UPDATE_PROFILE_SUCCESS,
        admin,
      }
    }
  }

  static async changePassword(body) {
    const { prevPassword } = body

    const admin = await AdminRepository.fetchAdmin({
      _id: new mongoose.Types.ObjectId(body.id),
    })

    if (!admin) return { success: false, msg: authMessages.ADMIN_NOT_FOUND }

    //verify password
    const prevPasswordCheck = await verifyPassword(prevPassword, admin.password)

    if (!prevPasswordCheck)
      return { success: false, msg: authMessages.INCORRECT_PASSWORD }

    //change password
    if (body.password !== body.confirmPassword) {
      return {
        success: false,
        msg: authMessages.MISMATCH_PASSWORD,
      }
    }

    let password = await hashPassword(body.password)

    const changePassword = await AdminRepository.updateAdminDetails(
      { _id: new mongoose.Types.ObjectId(body.id) },
      {
        password,
      }
    )

    if (changePassword) {
      return {
        success: true,
        msg: authMessages.PASSWORD_RESET_SUCCESS,
      }
    } else {
      return {
        success: false,
        msg: authMessages.PASSWORD_RESET_FAILURE,
      }
    }
  }

  static async uploadImageService(data, payload) {
    const { image } = data
    const user = await this.updateAdminService({
      params: { id: mongoose.Types.ObjectId(payload._id) },
      body: { image },
    })
    if (!user) {
      return {
        success: false,
        msg: adminMessages.UPDATE_IMAGE_FAILURE,
      }
    } else {
      return {
        success: true,
        msg: adminMessages.UPDATE_IMAGE_SUCCESS,
        user,
      }
    }
  }

  static async getLoggedInAdminService(adminPayload) {
    const { _id } = adminPayload
    const getAdmin = await AdminRepository.fetchAdmin({
      _id: new mongoose.Types.ObjectId(_id),
    })

    if (!getAdmin) return { success: false, msg: authMessages.ADMIN_NOT_FOUND }

    return { success: true, msg: authMessages.ADMIN_FOUND, data: getAdmin }
  }
}

module.exports = { AdminAuthService }
