const cloudinary = require("cloudinary").v2;
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const createOne = function (Model, ...options) {
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
      res.status(201).json({
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
const getAll = function (Model, ...choice) {
  return catchAsync(async (req, res, next) => {
    const list = await Model.find().select(choice.join(" "));
    res.status(200).json({
      status: "success",
      length: list.length,
      data: list,
    });
  });
};
const getOne = function (Model, id, popOption, ...choice) {
  return async (req, res, next) => {
    // let data = Model.findById(req.params[id]).select(choice.join(" "));
    let data = Model.findOne({ _id: req.params[id] }).select(choice.join(" "));

    if (popOption) data = data.populate(popOption);
    const doc = await data;
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: doc,
    });
  };
};

const updateOne = function (Model, id, ...options) {
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

      console.log(1, JSON.parse(id));
      const newData = await Model.findOne(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (req.file && req.file.path !== newData.imageCover) {
        cloudinary.uploader.destroy(newData.filename);
        newData.imageCover = req.file.path;
        newData.filename = req.file.filename;
      }

      // await newData.save();
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
const deleteOne = function (Model, id) {
  return catchAsync(async (req, res, next) => {
    const data = await Model.findByIdAndDelete(req.params[id]);
    if (!data) return next(new AppError("No document found with that ID", 404));
    if (data.filename) await cloudinary.uploader.destroy(data.filename);
    res.status(204).json({
      status: "success",
      data: null,
    });
  });
};
module.exports = {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
};
