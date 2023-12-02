const mongoose = require("mongoose")
const { NotificationRepository } = require("./notification.repository")
const { queryConstructor, verifyWhoAmI } = require("../../utils/index")
const { notificationMessages } = require("./notification.messages")
const { UserRepository } = require("../user/user.repository")
const { UserFailure } = require("../user/user.messages")
// const { sendMailNotification } = require("../../utils/email")

class NotificationService {
  static async create(payload) {
    return NotificationRepository.createNotification(payload)
  }

  static async fetchNotifications(query) {
    const { error, params, limit, skip, sort } = queryConstructor(
      query,
      "createdAt",
      "Notification"
    )

    if (error) return { success: false, msg: error }

    const notifications =
      await NotificationRepository.fetchNotificationsByParams({
        ...params,
        limit,
        skip,
        sort,
      })

    if (!notifications)
      return {
        success: false,
        msg: notificationMessages.NOTIFICATION_NOT_FOUND,
        data: [],
      }

    return {
      success: true,
      msg: notificationMessages.NOTIFICATION_FETCHED,
      data: notifications,
    }
  }

  static async postNotifications(body) {
    const { type, msg, recipientId } = body

    const recipient = await UserRepository.findSingleUserWithParams(
      {
        _id: new mongoose.Types.ObjectId(recipientId),
      },
      { email: 1, firstName: 1, lastName: 1 }
    )

    if (!recipient) return { success: false, msg: UserFailure.FETCH }

    let deliverNotification
    let success = true
    const title = "WhoUEpp Enterprise"
    switch (type) {
      case "sms":
        //sms notification
        deliverNotification = await sendSms(recipient.phoneNumber, msg)

        if (!deliverNotification.success) success = false
        break
      case "email":
        //email notification
        // deliverNotification = await sendMailNotification(
        //   recipient.email,
        //   title,
        //   {
        //     msg,
        //     name: recipient.fullName,
        //   },
        //   "NOTIFICATIONS"
        // )

        if (!deliverNotification.success) success = false
        break
      case "inApp":
        //InApp notification
        deliverNotification = await this.create({
          userId: new mongoose.Types.ObjectId(recipientId),
          title,
          message: msg,
        })

        if (!deliverNotification._id) success = false
        break
      default:
        //send to all platforms
        deliverNotification = await Promise.all([
          // sendSms(recipient.phoneNumber, msg),
          sendMailNotification(
            recipient.email,
            title,
            {
              msg,
              name: recipient.fullName,
            },
            "NOTIFICATIONS"
          ),
          this.create({
            userId: new mongoose.Types.ObjectId(recipientId),
            title,
            msg,
          }),
        ])
    }

    if (!success)
      return { SUCCESS: false, msg: notificationMessages.NOT_DELIVERED }

    return { SUCCESS: true, msg: notificationMessages.DELIVERED }
  }

  static async validateNotificationRecipient(payload) {
    const { recipientId } = payload
    if (Array.isArray(recipientId)) {
      const response = await Promise.all(
        recipientId.map((recipient) => {
          return this.postNotifications({
            type: payload.type,
            msg: payload.msg,
            recipientId: recipient,
          })
        })
      )
      return { SUCCESS: true, data: response }
    } else {
      return await this.postNotifications(payload)
    }
  }
}

module.exports = { NotificationService }
