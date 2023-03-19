const cloudinary = require("cloudinary").v2;
const AppError = require("../utils/appError");
const Product = require("./../models/ProductModel");
const catchAsync = require("./../utils/catchAsync");

exports.createProduct = async (req, res, next) => {
  try {
    if (!req.file) return next(new AppError("Please upload image", 500));
    req.body.imageCover = req.file.path;
    const product = await Product.create(req.body);
    res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (err) {
    if (req.file) {
      cloudinary.uploader.destroy(req.file.filename);
    }
    return next(err);
  }
};
exports.getAllProduct = catchAsync(async (req, res, next) => {
  const list = await Product.find().select("-photo -quantity -size");
  res.status(200).json({
    status: "success",
    length: list.length,
    data: list,
  });
});
exports.getProduct = catchAsync(async (req, res, next) => {});
