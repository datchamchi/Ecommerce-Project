const User = require("../models/UserModel");
const generalHandle = require("./../controllers/generalHandle");
exports.createUser = generalHandle.createOne(User, "user");
exports.getAllUser = generalHandle.getAll(User);
exports.getUser = generalHandle.getOne(User, "userId", null);
exports.deleteUser = generalHandle.deleteOne(User, "userId");
exports.updateUser = generalHandle.updateOne(User, "userId", "email");
