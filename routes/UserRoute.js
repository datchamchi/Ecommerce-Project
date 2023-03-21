const router = require("express").Router();
const userController = require("./../controllers/UserController");
const fileUpload = require("./../cloudinary.config");

router
  .route("/")
  .get(userController.getAllUser)
  .post(fileUpload.single("imageCover"), userController.createUser);
router
  .route("/:userId")
  .get(userController.getUser)
  .patch(fileUpload.single("imageCover"), userController.updateUser)
  .delete(userController.deleteUser);
module.exports = router;
