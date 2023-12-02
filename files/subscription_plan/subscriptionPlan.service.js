const { FORBIDDEN } = require("../../constants/statusCode")
const { queryConstructor } = require("../../utils")
const { SubscriptionPlanMessages } = require("./subscriptionPlan.messages")
const { SubscriptionPlanRepository } = require("./subscriptionPlan.repository")

class SubscriptionPlanService {
  static async createSubscriptionPlan(payload, locals) {
    const { body, image } = payload
    const { title, ...rest } = body

    const subscriptionPlan = await SubscriptionPlanRepository.create({
      title: title,
      serviceImage: image,
      ...rest,
    })

    if (!subscriptionPlan)
      return { success: false, msg: SubscriptionPlanMessages.CREATE_ERROR }

    return { success: true, msg: SubscriptionPlanMessages.CREATE_SUCCESS }
  }

  static async fetchSubscriptionPlan(query) {
    const { error, params, limit, skip, sort } = queryConstructor(
      query,
      "createdAt",
      "SubscriptionPlan"
    )

    if (error) return { success: false, msg: error }

    let extra = { isDeleted: false }

    const subscriptionPlans = await SubscriptionPlanRepository.find({
      ...params,
      ...extra,
      limit,
      skip,
      sort,
    })

    if (subscriptionPlans.length < 1)
      return { successs: false, msg: SubscriptionPlanMessages.NONE_FOUND }

    return {
      success: true,
      msg: SubscriptionPlanMessages.FETCH_SUCCESS,
      data: subscriptionPlans,
    }
  }

  static async updateSubscriptionPlan(payload, id) {
    const { body, image } = payload
    const { service, ...rest } = body
    const subscriptionPlan = await SubscriptionPlanRepository.update(id, {
      service: service,
      serviceImage: image,
      ...rest,
    })

    if (!subscriptionPlan)
      return { success: false, msg: SubscriptionPlanMessages.UPDATE_ERROR }

    return {
      success: true,
      msg: SubscriptionPlanMessages.UPDATE_SUCCESS,
    }
  }

  static async deleteSubscriptionPlan(data) {
    const { params } = data
    const subscriptionPlan = await SubscriptionPlanRepository.update(
      params.id,
      { isDeleted: true }
    )

    if (!subscriptionPlan)
      return { success: false, msg: SubscriptionPlanMessages.UPDATE_ERROR }

    return {
      success: true,
      msg: SubscriptionPlanMessages.UPDATE,
    }
  }
}

module.exports = { SubscriptionPlanService }
