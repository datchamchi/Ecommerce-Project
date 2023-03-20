const cloudinary = require("cloudinary").v2;
const AppError = require("../utils/appError");
const Product = require("./../models/ProductModel");
const catchAsync = require("./../utils/catchAsync");
const validateObjectId = require("./../utils/checkObjId");
exports.createProduct = async (req, res, next) => {
  try {
    if (!req.file) return next(new AppError("Please upload image", 500));
    req.body.imageCover = req.file.path;
    req.body.filename = req.file.filename;
    const product = await Product.create(req.body);
    res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (err) {
    if (req.file) {
      await cloudinary.uploader.destroy(req.file.filename);
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
exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);
  res.status(200).json({
    status: "success",
    data: product,
  });
});
exports.updateProduct = async (req, res, next) => {
  try {
    const newProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (req.file && req.file.path !== newProduct.imageCover) {
      cloudinary.uploader.destroy(newProduct.filename);
      newProduct.imageCover = req.file.path;
      newProduct.filename = req.file.filename;
      await newProduct.save();
    }
    res.status(200).json({
      status: "success",
      data: newProduct,
    });
  } catch (err) {
    if (req.file) {
      cloudinary.uploader.destroy(req.file.filename);
    }
    return next(new AppError("Cannot found the product id", 404));
  }
};
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.productId);
  if (!product) return next(new AppError("Cannot find the product id", 404));
  await cloudinary.uploader.destroy(product.filename);
  console.log(product);
  res.status(200).json({
    status: "success",
    data: null,
  });
});
