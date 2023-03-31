const jwt = require("jsonwebtoken");
const AppError = require("./appError");
const client = require("./initRedis");
const User = require("./../models/UserModel");
require("dotenv").config();

// authentication : login ,sign in, resetPassword
// jsonwebtoken: send by cookie

const signToken = (id, time) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: time,
  });
  return token;

  // await client.set(id, token, "EX", 100000);
};

exports.signAccesstoken = (id) => {
  const token = signToken(id, process.env.JWT_ACCESS_EXPIRE_IN);
  return token;
};
exports.signRefreshToken = (id) => {
  const token = signToken(id, process.env.JWT_REFRESH_EXPIRE_IN);
  return token;
};

exports.sendCookie = (res, id) => {
  const token = this.signAccesstoken(id);

  const optionCookie = {
    maxAge: process.env.COOKIE_EXPIRE_IN * 24 * 60 * 60 * 1000,
    httpOnly: false,
  };
  if (process.env.NODE_ENV === "production") optionCookie.httpOnly = true;
  res.cookie("jwt", token, optionCookie);
};
exports.verifyRefreshToken = (req, res, next, refreshToken) => {
  if (!refreshToken) {
    return next(new AppError("Cannot find refreshToken", 404));
  }
  jwt.verify(
    refreshToken,
    process.env.JWT_SECRET_KEY,
    async (error, result) => {
      if (error) {
        return next(
          new AppError("Cannot verify with refresh token. Login again", 400)
        );
      }
      if ((await client.get(result.id)) !== refreshToken) {
        return next(new AppError("Invalid refreshToken", 400));
      }
      this.sendCookie(res, result.id);
      const currentUser = await User.findById(result.id);
      req.user = currentUser;
      return next();
    }
  );
};
