const express = require("express");
const path = require("path");
// Module
const app = express();
require("dotenv").config();
const session = require("express-session");

const bodyParser = require("body-parser");
const cookieParse = require("cookie-parser");
const morgan = require("morgan");

// const helmet = require("helmet");

// Router
// const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/ProductRoute");
// const categoryRouter = require("./routes/CategoryRoute");
// const userRouter = require("./routes/UserRoute");
const viewRouter = require("./routes/viewRoute");

// const reviewRouter = require("./routes/ReviewRoute");
const errorHandle = require("./utils/errorHandling");
const cartRouter = require("./routes/cartRoute");
// const meRouter = require("./routes/meRoute");

//Thirty-part
// const client = require("./utils/initRedis");
// middleware
// app.use(helmet());   // tắt helmet để load đc ảnh
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParse());

// Static file
app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "secret session key",
    cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 },
    saveUninitialized: false
  })
);

// middleware router
app.get("/get-session", (req, res) => {
  // Lấy session từ yêu cầu và gửi nó về phía front-end
  res.status(200).json({ session: req.session.cartList });
});

app.use("/", viewRouter);
// app.use("/me", meRouter);
app.use("/api/products", productRouter);
// app.use("/api/users", userRouter);
// app.use("/categorys", categoryRouter);
app.use("/cart", cartRouter);
app.all("*", (req, res) => {
  res.status(400).json({
    message: "Invalid path"
  });
});
app.use(errorHandle);

module.exports = app;
