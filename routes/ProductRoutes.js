const router = require("express").Router();
const productController = require("./../controllers/ProductController");
const fileUpload = require("./../cloudinary.config");

router
  .route("/")
  .get(productController.getAllProduct)
  .post(fileUpload.single("imageCover"), productController.createProduct);

module.exports = router;
