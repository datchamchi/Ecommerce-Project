const router = require("express").Router();
const productController = require("./../controllers/ProductController");
const fileUpload = require("./../cloudinary.config");

router
  .route("/")
  .get(productController.getAllProduct)
  .post(fileUpload.single("imageCover"), productController.createProduct);
router
  .route("/:productId")
  .get(productController.getProduct)
  .patch(fileUpload.single("imageCover"), productController.updateProduct)
  .delete(productController.deleteProduct);
module.exports = router;
