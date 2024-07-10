const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    default: 1,
    min: 0,
  },
  discountAvailable: {
    type: Boolean,
    default: false,
  },
  discountPrice: {
    type: Number,
    default: 0,
    validator(val) {
      if (this.discountAvailable && val < this.price) {
        return true;
      }
      return false;
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
