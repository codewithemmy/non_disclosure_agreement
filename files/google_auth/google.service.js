const mongoose = require("mongoose")
require("../../utils/passport")
const {
  AlphaNumeric,
  hashPassword,
  verifyToken,
  generateOtp,
  tokenHandler,
} = require("../../utils")
const { sendMailNotification } = require("../../utils/email")
const createHash = require("../../utils/createHash")
const { sendSms } = require("../../utils/sms")
const { UserRepository } = require("../user/user.repository")
const passport = require("passport")

class GoogleAuthService {
  static async googleSuccessService(payload) {
    const { displayName, email } = payload

    const userExist = await UserRepository.validateUser({
      email,
    })

    if (userExist) {
      const user = await UserRepository.create({
        email,
        fullName: displayName,
        isVerified: true,
      })

      if (!user._id) return { success: false, msg: `unable to authenticate` }

      const substitutional_parameters = {
        name: fullName,
      }

      try {
        await sendMailNotification(
          email,
          "Sign-Up",
          substitutional_parameters,
          "WELCOME"
        )
      } catch (error) {
        console.log("error", error)
      }

      token = await tokenHandler({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        accountType: user.accountType,
        isAdmin: false,
      })

      const result = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        accountType: user.accountType,
        ...token,
      }

      return {
        success: true,
        msg: `successful`,
        data: result,
      }
    } else {
      const getUser = UserRepository.findSingleUserWithParams({ email })

      let token = await tokenHandler({
        _id: getUser._id,
        fullName: getUser.fullName,
        email: getUser.email,
        accountType: getUser.accountType,
        isAdmin: false,
      })

      const result = {
        _id: getUser._id,
        fullName: getUser.fullName,
        email: getUser.email,
        accountType: getUser.accountType,
        ...token,
      }

      return {
        success: true,
        msg: `successful`,
        data: result,
      }
    }
  }

  static async googleFailureService() {
    return {
      success: true,
      msg: `Something Went Wrong trying to get Authenticated`,
    }
  }
}

module.exports = GoogleAuthService
