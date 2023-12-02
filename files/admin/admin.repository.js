const mongoose = require("mongoose")
const { Admin } = require("../admin/admin.model")

class AdminRepository {
  static async create(body) {
    return Admin.create(body)
  }

  static async fetchAdmin(body) {
    const admin = await Admin.findOne({ ...body })
    return admin
  }

  static async updateAdminDetails(query, params) {
    return Admin.findOneAndUpdate({ ...query }, { $set: { ...params } })
  }

  static async findAdminParams(userPayload) {
    const { limit, skip, sort, ...restOfPayload } = userPayload
    const user = await Admin.find({
      ...restOfPayload,
      accountType: "normalAdmin",
    })
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return user
  }

  static async updateAdminById(id, params) {
    return Admin.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: { ...params } },
      { new: true, runValidators: true }
    )
  }
}

module.exports = { AdminRepository }
