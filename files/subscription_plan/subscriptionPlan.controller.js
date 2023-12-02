const { SUCCESS, BAD_REQUEST } = require("../../constants/statusCode")
const { responseHandler } = require("../../core/response")
const { manageAsyncOps, fileModifier } = require("../../utils")
const { CustomError } = require("../../utils/errors")
const { SubscriptionPlanService } = require("./subscriptionPlan.service")

const createSubscriptionPlans = async (req, res, next) => {
  let value = await fileModifier(req)
  const [error, data] = await manageAsyncOps(
    SubscriptionPlanService.createSubscriptionPlan(value, res.locals.jwt)
  )

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const fetchSubscriptionPlans = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    SubscriptionPlanService.fetchSubscriptionPlan(req.query)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const updateSubscriptionPlan = async (req, res, next) => {
  let value = await fileModifier(req)
  const [error, data] = await manageAsyncOps(
    SubscriptionPlanService.updateSubscriptionPlan(value, req.params.id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, 200, data)
}

const deleteSubscriptionPlan = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    SubscriptionPlanService.deleteSubscriptionPlan(req)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, 200, data)
}

module.exports = {
  createSubscriptionPlans,
  fetchSubscriptionPlans,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
}
