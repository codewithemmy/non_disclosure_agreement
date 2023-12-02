const { default: mongoose, mongo } = require("mongoose")
const { v4: uuidv4 } = require("uuid")
const { StripePaymentService } = require("../../../providers/stripe/stripe")
const {
  TransactionFailure,
  TransactionSuccess,
  TransactionMessages,
} = require("../transaction.messages")
const { UserRepository } = require("../../user/user.repository")

const { TransactionRepository } = require("../transaction.repository")
const { queryConstructor } = require("../../../utils")
const { OrderRepository } = require("../../order/order.repository")
const { OrderService } = require("../../order/order.service")
const {
  SubscriptionPlanRepository,
} = require("../../subscription_plan/subscriptionPlan.repository")

const uuid = uuidv4()

class TransactionService {
  static paymentProvider

  static async getConfig() {
    this.paymentProvider = new StripePaymentService()
  }

  static async initiateCheckoutSession(payload, host) {
    const { priceId, userId, channel, subscriptionId, quantity } = payload

    const user = await UserRepository.findSingleUserWithParams({
      _id: new mongoose.Types.ObjectId(userId),
    })

    if (!user) return { success: false, msg: `user not found` }

    await this.getConfig()
    const checkout = await this.paymentProvider.createCheckOutSession({
      priceId,
      quantity,
      userId,
      uuid,
    })

    if (!checkout)
      return { success: false, msg: `unable to successfully checkout` }

    const confirmTransaction = await TransactionRepository.fetchOne({
      priceId,
      userId,
    })

    const { id, amount_total } = checkout

    if (confirmTransaction) {
      await TransactionRepository.updateTransactionDetails(
        { priceId },
        { sessionId: id }
      )

      return {
        success: true,
        msg: TransactionSuccess.INITIATE,
        data: checkout,
      }
    }

    await TransactionRepository.create({
      name: user.fullName,
      email: user.email,
      cost: amount_total,
      userId,
      priceId,
      channel,
      transactionUuid: uuid,
      sessionId: id,
      subscriptionId,
    })

    return {
      success: true,
      msg: TransactionSuccess.INITIATE,
      data: checkout,
    }
  }

  static async retrieveCheckOutSession(payload) {
    const { uuid, userId } = payload

    const user = await UserRepository.findSingleUserWithParams({
      _id: new mongoose.Types.ObjectId(userId),
    })

    if (!user) return { success: false, msg: `user not found` }

    const transaction = await TransactionRepository.fetchOne({
      userId: new mongoose.Types.ObjectId(userId),
      transactionUuid: uuid,
    })

    if (!transaction) return { success: false, msg: `transaction not found` }

    await this.getConfig()
    const session = await this.paymentProvider.retrieveCheckOutSession(
      transaction.sessionId
    )

    if (!session.id)
      return { success: false, msg: `unable to unable to verify status` }

    const { status } = session

    const { priceId } = transaction

    let deliveryTime
    let planType

    transaction.status = status
    await transaction.save()

    if (status === "complete") {
      const subscription = await SubscriptionPlanRepository.fetchOne({
        $or: [
          { "availablePlans.basic.priceId": priceId },
          { "availablePlans.pro.priceId": priceId },
          { "availablePlans.max.priceId": priceId },
        ],
      })

      if (subscription.availablePlans.basic.priceId === priceId) {
        deliveryTime = subscription.availablePlans.basic.deliveryTime
        planType = "basic"
      } else if (subscription.availablePlans.pro.priceId === priceId) {
        deliveryTime = subscription.availablePlans.pro.deliveryTime
        planType = "pro"
      } else if (subscription.availablePlans.max.priceId === priceId) {
        deliveryTime = subscription.availablePlans.max.deliveryTime
        planType = "max"
      }

      const currentDate = new Date()
      const futureDate = new Date(
        currentDate.getTime() + deliveryTime * 24 * 60 * 60 * 1000
      )

      const futureDateISOString = futureDate.toISOString()

      await OrderService.createOrder({
        userId: new mongoose.Types.ObjectId(userId),
        orderName: transaction.subscriptionId,
        orderValue: transaction.cost,
        isConfirmed: true,
        status: "active",
        transactionId: transaction._id,
        dateOfDelivery: futureDateISOString,
        selectedTire: planType,
      })
    } else {
      await OrderService.createOrder({
        userId: new mongoose.Types.ObjectId(userId),
        orderName: transaction.subscriptionId,
        orderValue: transaction.cost,
        isConfirmed: true,
        transactionId: transaction._id,
      })
    }

    return {
      success: true,
      msg: TransactionSuccess.UPDATE,
      paymentStatus: status,
    }
  }
  static async getTransactionService(payload, locals) {
    const { error, params, limit, skip, sort } = queryConstructor(
      payload,
      "createdAt",
      "Transaction"
    )
    if (error) return { success: false, msg: error }

    // let teacher = { userId: new mongoose.Types.ObjectId(locals._id) }

    const transaction = await TransactionRepository.fetchTransactionsByParams({
      ...params,
      limit,
      skip,
      sort,
    })

    if (transaction.length < 1)
      return { success: false, msg: `you don't have any transaction history` }

    return {
      success: true,
      msg: `transaction fetched successfully`,
      data: transaction,
    }
  }
}

module.exports = { TransactionService }
