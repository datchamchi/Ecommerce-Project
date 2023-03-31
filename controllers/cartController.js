const Cart = require("./../utils/Cart");
const Product = require("./../models/ProductModel");

exports.addToCart = async (req, res) => {
  // try {
  const { productId, quantity } = req.body;

  const data = req.session.cart ? req.session.cart : {};

  const cart = new Cart(data);

  const product = await Product.findById(productId);
  cart.insertProduct(product, quantity);

  cart.saveSession(req);
  res.status(200).json({
    status: "success",
    total: cart.data.total,
  });
  // } catch (err) {
  //   res.status(200).json({
  //     message: "fail",
  //   });
  // }
};
exports.getcart = (req, res) => {
  // const { data } = Cart;
  res.status(200).json({
    status: "success",
    // message: data,
  });
};
