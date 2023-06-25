const Cart = require("../models/Cart");
const Product = require("./../models/ProductModel");
// const AppError = require("../utils/appError");

exports.addToCart = async (req, res) => {
  let check = false;
  if (!req.session.cartList) req.session.cartList = [];
  const product = await Product.findById(req.query.id);
  req.session.cartList.forEach((cart) => {
    if (cart.id === product.id) {
      cart.quantity += 1;
      check = true;
    }
  });

  if (!check) {
    const cart = new Cart(
      product._id,
      product.name,
      product.imageCover,
      product.priceOrigin,
      1
    );
    req.session.cartList.push(cart);
  }

  res.redirect("/cart");
};
exports.getCart = (req, res, next) => {
  res.render("cart", {
    cartList: req.session.cartList
  });
};
exports.deleteCart = async (req, res) => {
  const { id } = req.query;
  const { cartList } = req.session;
  const newList = cartList.filter((cart) => cart.id !== id);
  req.session.cartList = newList;
  res.redirect("/cart");
};
exports.changeQuantity = async (req, res) => {
  const { id, quantity } = req.body;
  const { cartList } = req.session;
  cartList.find((cart) => cart.id === id).quantity = quantity * 1;
  res.redirect("/cart");
};
