const catchAsync = require("../utils/catchAsync");
const Review = require("./../models/ReviewModel");
const generalHanhdle = require("./generalHandle");

const createReview = catchAsync(async (req, res, next) => {
  if (req.user) {
    req.body.product = req.params.productId;
    req.body.user = req.user;
    const newReview = await Review.create(req.body);
    res.status(200).json({
      status: "success",
      data: newReview,
    });
  }
});
const getAllReviews = generalHanhdle.getAll(Review);
const getReview = generalHanhdle.getOne(Review, "reviewId");
const updateReview = generalHanhdle.updateOne(Review, "reviewId");
const deleteReview = generalHanhdle.deleteOne(Review, "reviewId");

module.exports = {
  createReview,
  getAllReviews,
  getReview,
  updateReview,
  deleteReview,
};
