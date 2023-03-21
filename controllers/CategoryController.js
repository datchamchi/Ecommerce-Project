const Category = require("./../models/CategoryModel");
const generalHandle = require("./generalHandle");

exports.createCategory = generalHandle.createOne(Category, "category");
exports.getAllCategory = generalHandle.getAll(Category);
exports.getCategory = generalHandle.getOne(Category, "categoryId", {
  path: "products",
  select: "name imageCover priceOrigin priceSale price",
});
exports.updateCategory = generalHandle.updateOne(Category, "categoryId");
exports.deleteCategory = generalHandle.deleteOne(Category, "categoryId");
