const { default: mongoose } = require("mongoose")
const {
  hashPassword,
  verifyPassword,
  queryConstructor,
} = require("../../../utils")
const createHash = require("../../../utils/createHash")
const { UserSuccess, UserFailure } = require("../user.messages")
const { UserRepository } = require("../user.repository")
const { LIMIT, SKIP, SORT } = require("../../../constants")
const {
  ProfileFailure,
  ProfileSuccess,
} = require("../messages/profile.messages")
const { uploadImageManager } = require("../../../utils/multer")

class ProfileService {
  static async updateProfileService(id, payload) {
    if (!payload.files || !payload.files.image)
      return { success: false, msg: UserFailure.IMAGE }

    const image = await uploadImageManager(payload)

    delete payload.body.email
    const userprofile = await UserRepository.updateUserById(id, {
      photo: image.secure_url,
      ...payload.body,
    })

    if (!userprofile) return { success: false, msg: UserFailure.UPDATE }

    return {
      success: true,
      msg: UserSuccess.UPDATE,
    }
  }

  static async deleteProfileService(id, payload) {
    delete payload.email

    const userprofile = await UserRepository.deleteUserById(id, {
      ...payload,
    })

    if (!userprofile) return { success: false, msg: UserFailure.UPDATE }

    return {
      success: true,
      msg: UserSuccess.UPDATE,
    }
  }

  static async profileImage(payload, locals) {
    const updateUser = await UserRepository.updateUserProfile(
      { _id: locals._id },
      {
        ...payload,
      }
    )

    if (!updateUser) return { success: false, msg: UserFailure.FETCH }

    return { success: true, msg: ProfileSuccess.UPDATE }
  }

  static async getUserService(userPayload) {
    const { error, params, limit, skip, sort } = queryConstructor(
      userPayload,
      "createdAt",
      "User"
    )
    if (error) return { success: false, msg: error }

    const allUsers = await UserRepository.findAllUsersParams({
      ...params,
      limit,
      skip,
      sort,
    })

    if (allUsers.length < 1) return { success: false, msg: UserFailure.FETCH }

    return { success: true, msg: UserSuccess.FETCH, data: allUsers }
  }

  static async UpdateUserService(body, locals) {
    const user = await UserRepository.findSingleUserWithParams({
      _id: locals._id,
    })

    if (!user) return { success: false, msg: UserFailure.UPDATE }

    const updateUser = await UserRepository.updateUserProfile(
      { _id: locals._id },
      {
        ...body,
      }
    )

    if (!updateUser) return { success: false, msg: UserFailure.UPDATE }

    return { success: true, msg: UserSuccess.UPDATE }
  }

  static async changePasswordService(body, locals) {
    const { currentPassword, newPassword } = body

    const user = await UserRepository.findSingleUserWithParams({
      _id: locals._id,
    })

    if (!user) return { success: false, msg: UserFailure.UPDATE }

    const isPassword = await verifyPassword(currentPassword, user.password)

    if (!isPassword)
      return { success: false, msg: UserFailure.PASSWORD_MISMATCH }

    user.password = await hashPassword(newPassword)
    const updateUser = await user.save()

    if (!updateUser) return { success: false, msg: UserFailure.UPDATE }

    return { success: true, msg: UserSuccess.UPDATE }
  }

  static async getUserProfileService(payload) {
    let query = { _id: new mongoose.Types.ObjectId(payload) }
    const user = await this.getUserService(query)

    if (!user) return { success: false, msg: UserFailure.FETCH }

    return {
      success: true,
      msg: UserSuccess.FETCH,
      data: user,
    }
  }
}

module.exports = { ProfileService }
