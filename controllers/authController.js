const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const bcrypt = require("bcrypt");
const User = require("./../models/UserModel");

// authentication : login ,sign in, resetPassword
// jsonwebtoken: send by cookie

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 401));
  }
  const doc = await User.findOne({ email });
  if (!doc) return next(new AppError("No document found with this email", 401));
  if (!(await bcrypt.compare(password, doc.password))) {
    return next(new AppError("Incorect Password", 401));
  }
  req.session.user = doc;
  res.status(200).json({
    status: "success",
    message: "Login succesfully!",
  });
});
exports.logout = async (req, res, next) => {
  req.session.user = undefined;
  res.status(200).json({
    status: "success",
    message: "Logout succesfully!",
  });
};
exports.isLogin = async (req, res, next) => {
  if (!req.session.user) {
    return next(new AppError("You are not loggin. Please try again.."));
  } else next();
};
