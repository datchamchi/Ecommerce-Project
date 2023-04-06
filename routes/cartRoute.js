const router = require("express").Router();
const authController = require("./../controllers/authController");
const cartController = require("./../controllers/cartController");

router.use(authController.isLogin);
router.get("/", cartController.getCart);
router.post("/add-to-cart", cartController.addToCart);
module.exports = router;
