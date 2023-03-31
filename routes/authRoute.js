const router = require("express").Router();
const authController = require("./../controllers/authController");
const fileUpload = require("./../cloudinary.config");

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/signup", fileUpload.single("imageCover"), authController.signUp);
router.post("/forggotPassword", authController.forggotPassword);
router.post("/resetPassword/:token", authController.resetPassword);
module.exports = router;
