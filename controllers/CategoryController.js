const Category = require("./../models/CategoryModel");
const generalHandle = require("./generalHandle");

exports.createCategory = generalHandle.createOne(Category);
exports.getAllCategory = generalHandle.getAll(Category);
exports.getCategory = generalHandle.getOne(Category, "categoryId");
exports.updateCategory = generalHandle.updateOne(Category, "categoryId");
exports.deleteCategory = generalHandle.deleteOne(Category, "categoryId");
