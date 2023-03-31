require("dotenv").config();

const handleValidator = (err, res) => {
  err.statusCode = 400;
  err.status = "fail";
  let message = "";
  Object.values(err.errors).forEach((el) => (message += el.message + ". "));
  err.message = message;
};

const handleCastError = (err, res) => {
  err.statusCode = 404;
  (err.status = "fail"), (err.message = "Invalid id");
};
const handleDupplicateValue = (err, res) => {
  err.statusCode = 500;
  (err.status = "fail"), (err.message = "Duplicate value");
};
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
  else if (err.name === "CastError") handleCastError(err, res);
  else if (err.code === 11000) handleDupplicateValue(err, res);
  res.status(err.statusCode).json({
    status: err.status,
    err: err.message,
  });
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
