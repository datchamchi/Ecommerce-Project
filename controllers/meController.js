const cloudinary = require("cloudinary").v2;
const AppError = require("./../utils/appError");
const User = require("../models/UserModel");
const catchAsync = require("../utils/catchAsync");
// const generalHandle = require("./generalHandle");
const filterObj = (Obj, ...fields) => {
  fields.forEach((el) => {
    if (Obj[el]) delete Obj[el];
  });
};
const updateMe = function (...fields) {
  return async (req, res, next) => {
    try {
      // options để ktra nhưng thông tin không được update
      if (req.body.password)
        return next(
          new AppError(
            "The route is not permission. Using /updatepassword to change password"
          )
        );
      filterObj(req.body, fields);
      const newData = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
        runValidators: true
      });

      if (req.file && req.file.path !== newData.imageCover) {
        cloudinary.uploader.destroy(newData.filename);
        newData.imageCover = req.file.path;
        newData.filename = req.file.filename;
      }

      // await newData.save();
      res.status(200).json({
        status: "success",
        data: newData
      });
    } catch (err) {
      if (req.file) {
        cloudinary.uploader.destroy(req.file.filename);
      }
      return next(new AppError("No document found with that ID", 404));
    }
  };
};
const getMe = catchAsync(async (req, res, next) => {
  if (!req.user)
    return next(
      new AppError("You are not loggin. Please login and try again..", 401)
    );
  const data = await User.findById(req.user.id).select("");
  res.status(200).json({
    status: "success",
    data
  });
});
module.exports = {
  updateMe,
  getMe,
  filterObj
};
