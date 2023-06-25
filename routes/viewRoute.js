const express = require("express");

const router = express.Router();
const viewController = require("./../controllers/viewController");
const authRouter = require("./../routes/authRoute");

router.get("/", viewController.getHomePage);

router.get("/products", viewController.getProductPage);

router.get("/login", viewController.login);
router.use("/", authRouter);

module.exports = router;
