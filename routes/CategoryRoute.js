const router = require("express").Router();
const categoryController = require("./../controllers/CategoryController");
const fileUpload = require("./../cloudinary.config");
router
  .route("/")
  .get(categoryController.getAllCategory)
  .post(fileUpload.single("imageCover"), categoryController.createCategory);
router
  .route("/:categoryId")
  .get(categoryController.getCategory)
  .patch(fileUpload.single("imageCover"), categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;
