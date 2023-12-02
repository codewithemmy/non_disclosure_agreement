const { User } = require("./user.model")
const mongoose = require("mongoose")

class UserRepository {
  static async create(payload) {
    return await User.create(payload)
  }

  static async findUserWithParams(userPayload, select) {
    return await User.find({ ...userPayload }).select(select)
  }

  static async findSingleUserWithParams(userPayload, select) {
    const user = await User.findOne({ ...userPayload }).select(select)

    return user
  }

  static async validateUser(userPayload) {
    return User.exists({ ...userPayload })
  }

  static async findAllUsersParams(userPayload) {
    const { limit, skip, sort, ...restOfPayload } = userPayload

    const user = await User.find(
      { ...restOfPayload },
      { password: 0, verificationOtp: 0, isDelete: 0 }
    )
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return user
  }

  static async updateUserDetails(id, params) {
    return User.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      { $push: { ...params } } //returns details about the update
    )
  }

  static async updateUserProfile(payload, params) {
    return User.findOneAndUpdate({ ...payload }, { $set: { ...params } })
  }

  static async incrementUserById(id, params) {
    return await User.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      { $inc: { ...params} }
    )
  }

  static async updateUserById(id, params) {
    return await User.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: { ...params } }
    )
  }

  static async deleteUserById(id, params) {
    return await User.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      { $unset: { ...params } }
    )
  }
}

module.exports = { UserRepository }
