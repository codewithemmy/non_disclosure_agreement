const mongoose = require("mongoose")
const {
  AlphaNumeric,
  hashPassword,
  verifyToken,
  generateOtp,
} = require("../../utils")

const { sendMailNotification } = require("../../utils/email")
const createHash = require("../../utils/createHash")
const { sendSms } = require("../../utils/sms")
const { AuthFailure, AuthSuccess } = require("./auth.messages")
const { UserRepository } = require("../user/user.repository")

const { AdminRepository } = require("../admin/admin.repository")

class AuthService {
  static async verifyUser({ body }) {
    const { otp, email } = body

    const confirmOtp = await UserRepository.findSingleUserWithParams({
      verificationOtp: otp,
      email,
    })

    if (!confirmOtp) return { success: false, msg: AuthFailure.VERIFY_OTP }

    confirmOtp.isVerified = true
    confirmOtp.verificationOtp = ""
    confirmOtp.verified = Date.now()
    await confirmOtp.save()

    return {
      success: true,
      msg: AuthSuccess.VERIFY_OTP,
    }
  }

  static async forgotPassword(payload) {
    const { email } = payload
    const user = await UserRepository.findSingleUserWithParams({ email: email })

    if (!user) return { success: false, msg: AuthFailure.FETCH }

    const { otp, expiry } = generateOtp()

    //save otp to compare
    user.verificationOtp = otp
    await user.save()

    /**send otp to email or phone number*/
    const substitutional_parameters = {
      resetOtp: otp,
    }

    await sendMailNotification(
      email,
      "Reset Password",
      substitutional_parameters,
      "RESET_OTP"
    )

    return { success: true, msg: AuthSuccess.OTP_SENT }
  }

  static async resetPassword(body) {
    const { newPassword, email, otp } = body

    const findUser = await UserRepository.findSingleUserWithParams({
      email,
      verificationOtp: otp,
    })

    if (!findUser) return { success: false, msg: AuthFailure.FETCH }

    findUser.password = await hashPassword(newPassword)
    findUser.verificationOtp = ""

    const saveUser = await findUser.save()

    if (!saveUser) return { success: false, msg: AuthFailure.PASSWORD_RESET }

    return { success: true, msg: AuthSuccess.PASSWORD_RESET }
  }

  static async verifyOtpService(payload) {
    const { email } = payload
    const user = await UserRepository.findSingleUserWithParams({ email: email })

    if (!user) return { success: false, msg: AuthFailure.FETCH }

    const { otp, expiry } = generateOtp()

    user.verificationOtp = otp

    await user.save()

    const substitutional_parameters = {
      resetOtp: otp,
    }

    await sendMailNotification(
      email,
      "Reset Password",
      substitutional_parameters,
      "RESET_OTP"
    )

    return {
      success: true,
      msg: AuthSuccess.OTP_SENT,
    }
  }
}

module.exports = AuthService
