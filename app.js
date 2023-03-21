const express = require("express");
// Module
const app = express();
const bodyParser = require("body-parser");

// Router
const productRouter = require("./routes/ProductRoutes");
const categoryRouter = require("./routes/CategoryRoute");
const userRouter = require("./routes/UserRoute");
const errorHandle = require("./utils/errorHandling");

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// middleware router
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categorys", categoryRouter);
app.use("/api/v1/users", userRouter);
app.use(errorHandle);

module.exports = app;
