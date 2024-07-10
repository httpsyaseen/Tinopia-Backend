const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Product = require("./model/product"); 

const productsFilePath = path.join(__dirname, "products.json");

mongoose.connect(process.env.DB_LOCAL).then(() => {
  console.log("Connected to MongoDB");
});

fs.readFile(productsFilePath, "utf8", async (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  try {

    await Product.deleteMany();
  } catch (err) {
    console.error("Error parsing JSON:", err.message);
  }
});
