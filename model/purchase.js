const mongoose = require("mongoose");
const { Schema } = require("mongoose");

// Define the purchase schema
const purchaseSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    required: true,
  },

  isReviewed: {
    type: Boolean,
    default: false,
  },
});

// Create indexes to optimize queries
purchaseSchema.index({ user: 1, product: 1 });

// Create the Purchase model
const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;
