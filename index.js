const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const { globalErrorHandler } = require("./controller/errorController");
const AppError = require("./utils/appError");
const productRouter = require("./router/productRouter");
const userRouter = require("./router/userRouter");
const orderRouter = require("./router/orderRouter");
const reviewRouter = require("./router/reviewRouter");
const purchaseRouter = require("./router/purchaseRouter");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use(morgan("dev"));

app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/orders/", orderRouter);
app.use("/api/v1/purchases/", purchaseRouter);
app.use("/api/v1/reviews/", reviewRouter);

app.get("*", (req, res, next) => {
  next(new AppError("Route not found", 404));
});

app.use(globalErrorHandler);

mongoose
  .connect(
    "mongodb+srv://yaseenwalker1:tinopia@cluster0.wetcoub.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err, "Server shut down"));

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
