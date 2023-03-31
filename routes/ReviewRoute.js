const router = require("express").Router({ mergeParams: true });
const reviewController = require("../controllers/ReviewController");
const authController = require("../controllers/authController");

router.use(authController.isLogin, authController.permission("user"));
router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(reviewController.createReview);
router
  .route("/:reviewId")
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);
module.exports = router;
