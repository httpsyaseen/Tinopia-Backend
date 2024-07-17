const AppError = require("../utils/appError.js");

const handleCastError = (err) => {
  return new AppError("Invalid or Duplicate Data", 400);
};

const handleDuplicateError = (err) => {
  return new AppError(`Duplicate Field. Please use another name`, 400);
};

const handleValidationError = (err) => {
  return new AppError("Invalid Data", 400);
};

const sendDevEror = (error, res) => {
  return res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    error: error.stack,
  });
};

const sendProdError = (error, res) => {
  return res.status(500).json({
    status: "error",
    message: "Something went Wrong",
  });
};

const handleJsonWebTokenError = (err) =>
  new AppError("Invalid Token. Please login again", 401);

const handleTokenExpiredError = (err) =>
  new AppError("Login Session Expired. Login Again", 401);

exports.globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (err.isOperational) {
    return sendDevEror(err, res);
  }
  let error = { ...err };
  if (err.name === "CastError") error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateError(error);
  if (err.name === "ValidationError") error = handleValidationError(err);
  if (err.name === "JsonWebTokenError") error = handleJsonWebTokenError(err);
  if (err.name === "TokenExpiredError") error = handleTokenExpiredError(err);
  if (error.isOperational) {
    sendDevEror(error, res);
  } else {
    sendProdError(error, res);
  }
};
