const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const productRouter = require("./router/productRouter");

const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/products", productRouter);
app.get("*", (req, res) => {
  res.send("404");
});

mongoose.connect(process.env.DB_LOCAL).then(() => {
  console.log("Connected to MongoDB");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
