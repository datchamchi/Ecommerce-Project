const catchAsync = require("./../utils/catchAsync");
const cloudinary = require("cloudinary").v2;
const AppError = require("./../utils/appError");
exports.createOne = (Model, ...options) => {
  return async (req, res, next) => {
    try {
      if (!req.file && !options.includes("user")) {
        return next(new AppError("Please upload image", 404));
      }
      if (req.file) {
        req.body.imageCover = req.file.path;
        req.body.filename = req.file.filename;
      }
      const data = await Model.create(req.body);
      res.status(200).json({
        status: "success",
        data: data,
      });
    } catch (err) {
      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      return next(err);
    }
  };
};
exports.getAll = (Model, ...choice) => {
  return catchAsync(async (req, res, next) => {
    const list = await Model.find().select(choice.join(" "));
    res.status(200).json({
      status: "success",
      length: list.length,
      data: list,
    });
  });
};
exports.getOne = (Model, id, popOption, ...choice) => {
  return catchAsync(async (req, res, next) => {
    let data = Model.findById(req.params[id]).select(choice.join(" "));

    if (popOption) data = data.populate(popOption);
    const doc = await data;
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: doc,
    });
  });
};
exports.updateOne = (Model, id, ...options) => {
  return async (req, res, next) => {
    try {
      // options để ktra nhưng thông tin không được update
      if (req.body.password)
        return next(
          new AppError(
            "The route is not permission. Using /updatepassword to change password"
          )
        );
      if (options.length > 0) {
        options.forEach((el) => {
          if (req.body[el]) delete req.body[el];
        });
      }
      const newData = await Model.findByIdAndUpdate(req.params[id], req.body, {
        new: true,
        runValidators: true,
      });

      if (req.file && req.file.path !== newData.imageCover) {
        cloudinary.uploader.destroy(newData.filename);
        newData.imageCover = req.file.path;
        newData.filename = req.file.filename;
      }
      await newData.save();
      res.status(200).json({
        status: "success",
        data: newData,
      });
    } catch (err) {
      if (req.file) {
        cloudinary.uploader.destroy(req.file.filename);
      }
      return next(new AppError("No document found with that ID", 404));
    }
  };
};
exports.deleteOne = (Model, id) => {
  return catchAsync(async (req, res, next) => {
    const data = await Model.findByIdAndDelete(req.params[id]);
    if (!data) return next(new AppError("No document found with that ID", 404));
    if (data.filename) await cloudinary.uploader.destroy(data.filename);
    res.status(200).json({
      status: "success",
      data: null,
    });
  });
};
