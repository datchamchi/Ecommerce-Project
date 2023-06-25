const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const AppError = require("../utils/appError");

const checkout = (req, res, next) => {
  if (req.session.cart) return next(new AppError("Cart is empty", 404));
};
