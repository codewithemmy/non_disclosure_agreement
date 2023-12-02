const { default: mongoose } = require("mongoose")
const { LIMIT, SKIP, SORT } = require("../../constants")
const { SubscriptionPlan } = require("./subscriptionPlan.model")

class SubscriptionPlanRepository {
  static async create(subscriptionPlanPayload) {
    return await SubscriptionPlan.create({ ...subscriptionPlanPayload })
  }

  static async fetchOne(payload) {
    return SubscriptionPlan.findOne({ ...payload })
  }

  static async find(payload, select = { isDeleted: 0, __v: 0 }) {
    const {
      limit = LIMIT,
      skip = SKIP,
      sort = SORT,
      ...restOfPayload
    } = payload

    return await SubscriptionPlan.find({ ...restOfPayload })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(select)
  }

  static async fetch(payload, select) {
    return SubscriptionPlan.find({ ...payload }).select(select)
  }

  static async update(id, params) {
    return await SubscriptionPlan.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: { ...params } }
    )
  }
}

module.exports = { SubscriptionPlanRepository }
