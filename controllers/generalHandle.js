const catchAsync = require("./../utils/catchAsync");
const cloudinary = require("cloudinary").v2;
const AppError = require("./../utils/appError");
exports.createOne = (Model) => {
  return async (req, res, next) => {
    try {
      if (!req.file) return next(new AppError("Please upload image", 500));
      req.body.imageCover = req.file.path;
      req.body.filename = req.file.filename;
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
exports.getOne = (Model, id, ...choice) => {
  return catchAsync(async (req, res, next) => {
    const data = await Model.findById(req.params[id]).select(choice.join(" "));
    res.status(200).json({
      status: "success",
      data: data,
    });
  });
};
exports.updateOne = (Model, id) => {
  return async (req, res, next) => {
    try {
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
      return next(new AppError("Cannot found id", 404));
    }
  };
};
exports.deleteOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const data = await Model.findByIdAndDelete(req.params.productId);
    if (!data) return next(new AppError("Cannot find the product id", 404));
    await cloudinary.uploader.destroy(data.filename);
    res.status(200).json({
      status: "success",
      data: null,
    });
  });
};
