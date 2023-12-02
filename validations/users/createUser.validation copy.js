const { User } = require("../../files/user/user.model")

const createUserValidation = {
  name: {
    notEmpty: true,
    errorMessage: "First name cannot be empty",
  },
  email: {
    notEmpty: true,
    errorMessage: "Email cannot be empty",
    isEmail: {
      errorMessage: "Invalid email address",
    },
    custom: {
      options: (v) => {
        return User.find({
          email: v,
        }).then((user) => {
          if (user.length > 0) {
            return Promise.reject("Email already in use")
          }
        })
      },
    },
  },
  password: {
    notEmpty: true,
    errorMessage: "Password cannot be empty",
  },
}

module.exports = { createUserValidation }
