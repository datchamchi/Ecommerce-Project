const router = require("express").Router();
const authController = require("./../controllers/authController");
const cartController = require("./../controllers/cartController");

// router.use(authController.isLogin);
router.get("/", cartController.getCart);
router.get("/add-to-cart", cartController.addToCart);
router.get("/remove-product-from-cart", cartController.deleteCart);
router.post("/change-quantity", cartController.changeQuantity);
module.exports = router;
