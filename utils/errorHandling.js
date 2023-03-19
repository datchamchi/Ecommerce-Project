require("dotenv").config();

const handleValidator = (err, res) =>
  res.status(err.statusCode).json({
    status: "fail",
    message: "Cannot create the model ",
  });
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    err: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.name === "ValidationError") handleValidator(err, res);
};
const errorHandle = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProd(err, res);
  }
};

module.exports = errorHandle;
