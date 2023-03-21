const express = require("express");
// Module
const app = express();
const bodyParser = require("body-parser");

// Router
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/ProductRoutes");
const categoryRouter = require("./routes/CategoryRoute");
const userRouter = require("./routes/UserRoute");
const errorHandle = require("./utils/errorHandling");

//Thirty-part
const session = require("express-session");

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "apifeature",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// middleware router
app.use("/", authRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categorys", categoryRouter);
app.use("/api/v1/users", userRouter);
app.use(errorHandle);

module.exports = app;
