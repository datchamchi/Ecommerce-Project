const Product = require("../models/ProductModel");

const getHomePage = async (req, res) => {
  const list = await Product.find();

  res.render("home", {
    user: req.user,
    list
  });
};
const getProductPage = async (req, res) => {
  const product = await Product.findOne({ _id: req.query.id });

  res.render("product", {
    product
  });
};
const login = (req, res) => {
  res.render("login");
};

module.exports = {
  getHomePage,
  getProductPage,
  login
};
