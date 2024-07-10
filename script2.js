const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Product = require("./model/product");

mongoose.connect(process.env.DB_REMOTE).then(() => {
  console.log("Connected to MongoDB");
});

const jsonFilePath = path.join(__dirname, "products.json");
const productsData = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));

// Process each product
productsData.forEach(async (product) => {
  const imagePath = path.join(__dirname, product.image);

  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString("base64");
    product.image = imageBase64;

    const newProduct = new Product(product);

    await newProduct.save();
    console.log(`Product ${product.name} saved successfully.`);
  } catch (error) {
    console.error(`Error processing product ${product.name}: `, error);
  }
});
