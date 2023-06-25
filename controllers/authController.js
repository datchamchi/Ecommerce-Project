const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
const generalHandle = require("./generalHandle");
const AppError = require("./../utils/appError");
const client = require("./../utils/initRedis");
const User = require("./../models/UserModel");
const signToken = require("./../utils/service_token");
const sendEmail = require("./../utils/sendEmail");
require("dotenv").config({ path: "config.env" });

const optionCookie = {
  maxAge: process.env.COOKIE_EXPIRE_IN * 24 * 60 * 60 * 1000,
  httpOnly: false
};

require("dotenv").config();
// authentication : login ,sign in, resetPassword
// jsonwebtoken: send by cookie

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 401));
  }
  const doc = await User.findOne({ email });
  if (!doc) return next(new AppError("No document found with this email", 401));
  if (!(await doc.comparePassword(password, doc.password))) {
    return next(new AppError("Incorect Password", 401));
  }
  // req.session.user = doc; // if using session
  try {
    const accessToken = await signToken.signAccesstoken(doc.id);
    if (process.env.NODE_ENV === "production") optionCookie.httpOnly = true;
    res.cookie("accessToken", accessToken, optionCookie);
    const refreshToken = await signToken.signRefreshToken(doc.id);
    await client.set(doc.id, refreshToken);
    await client.expire(doc.id, 365 * 24 * 60 * 60);
    res.status(200).json({
      status: "success",
      message: "Login succesfully!",
      accessToken,
      refreshToken,
      userId: doc.id
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      err
    });
  }

  // save id in refreshToken
};
const getRefreshToken = async (req, res) => {
  const { id, refreshToken } = req.body;
  if (!refreshToken)
    return res.status(403).json({ message: "No refresh token" });
  if (refreshToken !== (await client.get(id)))
    return res.status(403).json({ message: "Refresh token is invalid" });
  const accessToken = await signToken.signAccesstoken(id);
  if (process.env.NODE_ENV === "production") optionCookie.httpOnly = true;
  res.cookie("accessToken", accessToken, optionCookie);
  const newRefreshToken = await signToken.signRefreshToken(id);
  await client.set(id, newRefreshToken);
  await client.expire(id, 365 * 24 * 60 * 60);
  res.status(403).json({ accessToken, newRefreshToken });
};
const logout = (req, res) => {
  res.cookie("jwt", "logout", {
    maxAge: Date.now(),
    httpOnly: false
  });

  res.status(200).json({
    status: "success",
    message: "Logout succesfully!"
  });
};
const isLogin = async (req, res, next) => {
  try {
    if (!req.cookies.jwt) {
      return next(new AppError("You are not loggin. Please try again..", 401));
    }
    const decode = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);

    const currentUser = await User.findById(decode.id);

    req.user = currentUser;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      const { refreshToken } = req.body;
      signToken.verifyRefreshToken(req, res, next, refreshToken);
    } else
      return next(new AppError("Cannot verify with jwt. Login again", 401));
  }
};

const protect = async (req, res, next) => {
  try {
    if (!req.cookies.accessToken) {
      return next();
    }
    const decode = jwt.verify(
      req.cookies.accessToken,
      process.env.ACCESS_TOKEN_KEY
    );

    const currentUser = await User.findById(decode.id);

    req.user = currentUser;
    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      const { refreshToken } = await client;
      signToken.verifyRefreshToken(req, res, next, refreshToken);
    } else return next();
  }
};
const updatePassword = catchAsync(async (req, res, next) => {
  if (!req.user)
    return next(new AppError("You are not loggin. Please try again..", 401));
  const { user } = req;
  const { currentPassword, newPassword, passwordConfirm } = req.body;
  if (!(await user.comparePassword(currentPassword, user.password))) {
    return next(new AppError("Incorrect currently password", 401));
  }
  user.password = newPassword;
  user.passwordConfirm = passwordConfirm;
  user.passwordChangedAt = Date.now();
  const newUser = await user.save();
  signToken.sendCookie(res, newUser.id);
  res.status(200).json({
    status: "success",
    data: newUser
  });
});
const signUp = generalHandle.createOne(User, "user");
const permission = function (...role) {
  return (req, res, next) => {
    console.log(req.user);
    if (role.includes(req.user.role)) return next();
    return next(
      new AppError("You are not permission to implement this action", 403)
    );
  };
};
const forggotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError("Please provide email", 404));
  const user = await User.findOne({ email });
  if (!user) return next(new AppError("Cannot find user with this email", 404));
  const token = await user.createResetPasswordToken();
  try {
    const optionsEmail = {
      email: "bduihai@gmail.com",
      subject: "Your Password ResetToken ( Valid for 10 minutes)",
      message: `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${
        req.protocol
      }://${req.get("host")}/resetPassword/${token}.
    If you didn't forget your password, please ignore this email! `
    };
    sendEmail(optionsEmail);

    res.status(200).json({
      status: "Token send to email successfully!!",
      token
    });
  } catch (err) {
    user.tokenResetPassword = undefined;
    user.tokenResetPasswordExpire = undefined;
    user.save({ validateBeforeSave: false });
    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
};
const resetPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    tokenResetPassword: req.params.token,
    tokenResetPasswordExpire: { $gte: Date.now() }
  });
  if (!user) return next(new AppError("This token is not valid", 403));
  const { newPassword, passwordConfirm } = req.body;
  user.password = newPassword;
  user.passwordConfirm = passwordConfirm;
  user.tokenResetPassword = undefined;
  user.tokenResetPasswordExpire = undefined;
  // console.log(user.password, user.passwordConfirm);
  await user.save({ validateBeforeSave: true });
  res.status(200).json({
    status: "success",
    message: "Change password succesfully",
    user
  });
});

module.exports = {
  login,
  isLogin,
  logout,
  signUp,
  updatePassword,
  permission,
  forggotPassword,
  resetPassword,
  protect,
  getRefreshToken
};
