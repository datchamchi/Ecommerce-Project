const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const bcrypt = require("bcrypt");
const User = require("./../models/UserModel");
const jwt = require("jsonwebtoken");
const { use } = require("../routes/authRoute");
require("dotenv").config();
// authentication : login ,sign in, resetPassword
// jsonwebtoken: send by cookie
const sendCookie = async (res, id) => {
  const token = await signtoken(id);
  const optionCookie = {
    maxAge: process.env.COOKIE_EXPIRE_IN * 24 * 60 * 60 * 1000,
    httpOnly: false,
  };
  if (process.env.NODE_ENV === "production") optionCookie.httpOnly = true;
  res.cookie("jwt", token, optionCookie);
};
const signtoken = async (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 401));
  }
  let doc = await User.findOne({ email });
  if (!doc) return next(new AppError("No document found with this email", 401));
  if (!(await doc.comparePassword(password, doc.password))) {
    return next(new AppError("Incorect Password", 401));
  }
  // req.session.user = doc; // if using session
  await sendCookie(res, doc.id);
  res.status(200).json({
    status: "success",
    message: "Login succesfully!",
    user: doc,
  });
});
exports.logout = catchAsync(async (req, res, next) => {
  await sendCookie(res, "logout");
  req.user = undefined;
  res.status(200).json({
    status: "success",
    message: "Logout succesfully!",
  });
});
exports.isLogin = async (req, res, next) => {
  try {
    if (!req.cookies.jwt) {
      return next(new AppError("You are not loggin. Please try again..", 401));
    } else {
      const decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);
      const currentUser = await User.findById(decode.id);
      req.user = currentUser;
      next();
    }
  } catch (err) {
    return next(new AppError("Cannot verify with jwt. Login again", 404));
  }
};
exports.updatePassword = catchAsync(async (req, res, next) => {
  if (!req.user)
    return next(new AppError("You are not loggin. Please try again..", 401));
  const user = req.user;
  const { currentPassword, newPassword, passwordConfirm } = req.body;
  if (!(await user.comparePassword(currentPassword, user.password))) {
    return next(new AppError("Incorrect currently password", 401));
  }
  user.password = newPassword;
  user.passwordConfirm = passwordConfirm;
  user.passwordChangedAt = Date.now();
  const newUser = await user.save();
  await sendCookie(res, newUser.id);
  res.status(200).json({
    status: "success",
    data: newUser,
  });
});
