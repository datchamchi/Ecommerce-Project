// const AppError = require("../utils/appError");
const Product = require("./../models/ProductModel");

const generalHandle = require("./generalHandle");

const getAllProduct = async (req, res, next) => {
  console.log(req.session.cartList)
  try {
    const fields = req.query.fields
      ? req.query.fields.split(",").join(" ")
      : "";

    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;
    const sort = req.query.sort
      ? req.query.sort.split(",").join(" ")
      : "ratingsAverage sort";

    const data = await Product.find()
      .select(fields)
      .skip(skip)
      .limit(limit)
      .sort(sort);
    res.status(200).json({
      status: "success",
      length: data.length,
      data
    });
  } catch (err) {
    return next(err);
  }
};

const createProduct = generalHandle.createOne(Product, "product");
const getProduct = generalHandle.getOne(Product, "productId", {
  path: "reviews",
  select: "-product"
});
const updateProduct = generalHandle.updateOne(Product, "productId");
const deleteProduct = generalHandle.deleteOne(Product, "productId");

module.exports = {
  createProduct,
  getAllProduct,
  getProduct,
  updateProduct,
  deleteProduct
};
