const express = require("express");
// Module
const app = express();
require("dotenv").config();
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
  uri: "mongodb+srv://janedat:dat12345678@cluster0.04bsb4k.mongodb.net/?retryWrites=true&w=majority",
  collection: "sessions",
});

const bodyParser = require("body-parser");
const cookieParse = require("cookie-parser");
const morgan = require("morgan");

const helmet = require("helmet");

// Router
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/ProductRoute");
const categoryRouter = require("./routes/CategoryRoute");
const userRouter = require("./routes/UserRoute");
// const reviewRouter = require("./routes/ReviewRoute");
const errorHandle = require("./utils/errorHandling");
const cartRouter = require("./routes/cartRoute");
const meRouter = require("./routes/meRoute");

//Thirty-part
// const client = require("./utils/initRedis");
// middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParse());

app.use(
  session({
    secret: "secret session key",
    resave: false,
    saveUninitialized: true,
    store: store,
    unset: "destroy",
    name: "session cookie name",
  })
);

// middleware router
app.use("/", authRouter);
app.use("/cart", cartRouter);
app.use("/users", userRouter);
app.use("/me", meRouter);
app.use("/products", productRouter);
app.use("/categorys", categoryRouter);
app.all("*", (req, res) => {
  res.status(400).json({
    message: "Invalid path",
  });
});
app.use(errorHandle);

module.exports = app;
