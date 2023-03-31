const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (el) {
        return validator.isEmail(el);
      },
      message: (el) => `${el} is invalid email`,
    },
  },
  role: {
    type: String,
    enum: ["user", "seller", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minLength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please provide password Confirm"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "PasswordConfirm and Password is not the same.",
    },
  },
  passwordChangedAt: Date,
  tokenResetPassword: String,
  tokenResetPasswordExpire: Date,
  imageCover: {
    type: String,
  },
  filename: {
    type: String,
  },
});
UserSchema.methods.comparePassword = async function (password, passwordHash) {
  return await bcrypt.compare(password, passwordHash);
};
UserSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
    this.passwordConfirm = undefined;
    this.passwordChangedAt = Date.now();
  }
});
UserSchema.methods.createResetPasswordToken = async function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.tokenResetPassword = token;
  this.tokenResetPasswordExpire = Date.now() + 10 * 60 * 1000;
  this.save({ validateBeforeSave: false });
  return token;
};
const User = mongoose.model("User", UserSchema);
module.exports = User;
