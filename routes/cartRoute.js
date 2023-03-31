const router = require("express").Router();
const authController = require("./../controllers/authController");
const cartController = require("./../controllers/cartController");

router.use(authController.isLogin);
router.post("/add-to-cart", cartController.addToCart);
// router.post("/cart", cartController.getCart);
module.exports = router;
