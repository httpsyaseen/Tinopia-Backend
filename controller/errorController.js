const AppError = require("../utils/appError.js");

const handleCastError = (err) => {
  return new AppError("Invalid Id", 400);
};

const handleDuplicateError = (err) => {
  return new AppError(`Duplicate Field. Please use another name`, 400);
};

const handleValidationError = (err) => {
  return new AppError("Invalid Data", 400);
};

exports.globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  let error = { ...err };
  if (err.name === "CastError") error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateError(error);
  if (err.name === "ValidationError") error = handleValidationError(err);
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went Wrong",
    });
  }
};
