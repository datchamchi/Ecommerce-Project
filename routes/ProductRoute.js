const router = require("express").Router();
const productController = require("../controllers/ProductController");
const authController = require("../controllers/authController");
const fileUpload = require("../cloudinary.config");
const reviewRouter = require("./ReviewRoute");

router.use("/:productId/reviews", reviewRouter);
router.route("/").get(productController.getAllProduct).post(
  // authController.permission("seller"),
  fileUpload.single("imageCover"),
  productController.createProduct
);
router
  .route("/:productId")
  .get(productController.getProduct)
  .patch(
    authController.permission("seller"),
    fileUpload.single("imageCover"),
    productController.updateProduct
  )
  .delete(
    authController.permission("seller", "admin"),
    productController.deleteProduct
  );
module.exports = router;
