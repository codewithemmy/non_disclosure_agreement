const { default: mongoose, mongo } = require("mongoose")
const { Contract } = require("./contract.model")
const { LIMIT, SKIP, SORT } = require("../../constants")

class ContractRepository {
  static async create(contractPayload) {
    return Contract.create({ ...contractPayload })
  }

  static async fetchOne(payload) {
    return Contract.findOne({ ...payload })
  }

  static async fetch(payload, select) {
    const {
      limit = LIMIT,
      skip = SKIP,
      sort = SORT,
      ...restOfPayload
    } = payload

    return await Contract.find({
      ...restOfPayload,
    })
      .populate({
        path: "clientId",
        select: "fullName email photo",
      })
      // .populate({ path: "contractPlan" })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(select)
  }

  static async updateContract(id, params) {
    return Contract.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: { ...params } },
      { new: true, runValidator: true }
    )
  }

  static async updateContractByParams(payload, body) {
    return Contract.findOneAndUpdate(
      { ...payload },
      { ...body },
      { new: true, runValidator: true }
    )
  }
}

module.exports = { ContractRepository }
