const Product = require("./product");
const User = require("./user");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Order Schema
const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  orderDate: {
    type: Date,
    default: Date.now,
  },
  totalCost: {
    type: Number,
    required: true,
  },

  shipped: {
    type: Boolean,
    default: false,
  },

  status: {
    type: String,
    default: "not delivered",
    enum: ["not delivered", "delivered"],
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
