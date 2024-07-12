const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const productRouter = require("./router/productRouter");
const userRouter = require("./router/userRouter");
const AppError = require("./utils/appError");
const { globalErrorHandler } = require("./controller/errorController");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/products", productRouter);
app.use("/api/v1/users", userRouter);

app.get("*", (req, res, next) => {
  next(new AppError("Route not found", 404));
});

app.use(globalErrorHandler);

mongoose
  .connect(process.env.DB_LOCAL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log("Server shut down"));

const server = app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

process.on("unhandledRejection", () => {
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", () => {
  server.close(() => {
    process.exit(1);
  });
});
