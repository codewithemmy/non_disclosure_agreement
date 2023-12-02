const { Notification } = require("./notification.model")

class NotificationRepository {
  static async createNotification(notificationPayload) {
    return await Notification.create(notificationPayload)
  }

  static async findSingleNotificationByParams(notificationPayload) {
    return await Notification.findOne({ ...notificationPayload })
  }

  static async fetchNotificationsByParams(userPayload) {
    let { limit, skip, sort, ...restOfPayload } = userPayload

    const notification = await Notification.find({
      ...restOfPayload,
    })
      .populate("userId", {
        firstName: 1,
        lastName: 1,
        profileImage: 1,
      })
      .populate("recipientId", {
        firstName: 1,
        lastName: 1,
      })
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return notification
  }
}

module.exports = { NotificationRepository }
