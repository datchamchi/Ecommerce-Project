const cloudinary = require("cloudinary").v2;
const AppError = require("../utils/appError");
const Product = require("./../models/ProductModel");
const catchAsync = require("./../utils/catchAsync");
const generalHandle = require("./generalHandle");

exports.createProduct = generalHandle.createOne(Product, "product");
exports.getAllProduct = generalHandle.getAll(
  Product,
  "-photo",
  "-size",
  "-quantity"
  // "-filename"
);
exports.getProduct = generalHandle.getOne(Product, "productId");
exports.updateProduct = generalHandle.updateOne(Product, "productId");
exports.deleteProduct = generalHandle.deleteOne(Product, "productId");
