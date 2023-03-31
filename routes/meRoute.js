const router = require("express").Router();
const fileUpload = require("./../cloudinary.config");
const authController = require("./../controllers/authController");
const meController = require("./../controllers/meController");
// const User = require("../models/UserModel");

router.use(authController.isLogin, authController.permission("user"));
router.get("/", meController.getMe);
router.patch(
  "/updateMe",
  fileUpload.single("imageCover"),
  meController.updateMe("email", "password")
);
router.post("/updatePassword", authController.updatePassword);
module.exports = router;
