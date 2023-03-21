const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
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
  imageCover: {
    type: String,
  },
  filename: {
    type: String,
  },
});
UserSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew()) {
    this.password = await bcrypt.hash(this.password, 10);
    this.passwordConfirm = undefined;
  }
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
