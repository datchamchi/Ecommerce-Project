const Product = require("./../models/ProductModel");

const generalHandle = require("./generalHandle");

const createProduct = generalHandle.createOne(Product, "product");
const getAllProduct = generalHandle.getAll(
  Product,
  "-photo",
  "-size",
  "-quantity"
  // "-filename"
);
const getProduct = generalHandle.getOne(Product, "productId", {
  path: "reviews",
  select: "-product",
});
const updateProduct = generalHandle.updateOne(Product, "productId");
const deleteProduct = generalHandle.deleteOne(Product, "productId");

module.exports = {
  createProduct,
  getAllProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
