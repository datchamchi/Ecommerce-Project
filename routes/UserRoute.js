const router = require("express").Router();
const userController = require("./../controllers/UserController");
// const fileUpload = require("./../cloudinary.config");
const authController = require("./../controllers/authController");

router.use(authController.isLogin, authController.permission("admin"));
router.route("/").get(userController.getAllUser);

router
  .route("/:userId")
  .get(userController.getUser)
  .delete(userController.deleteUser);
module.exports = router;
