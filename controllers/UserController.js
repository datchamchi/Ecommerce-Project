const User = require("../models/UserModel");
const AppError = require("../utils/appError");
const generalHandle = require("./../controllers/generalHandle");

exports.createUser = (req, res, next) =>
  next(
    new AppError(
      "Incorrect path. Please log in /signUp router and try again ",
      401
    )
  );
exports.getAllUser = generalHandle.getAll(User);
exports.getUser = generalHandle.getOne(User, "userId", null);
exports.deleteUser = generalHandle.deleteOne(User, "userId");
exports.updateUser = generalHandle.updateOne(
  User,
  "userId",
  "email",
  "password"
);
