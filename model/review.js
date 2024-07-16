const mongoose = require("mongoose");
const Product = require("./product");

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "Write something in review"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, "A review must have rating"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
  reviewDate: {
    type: Date,
    default: Date.now(),
  },
});

reviewSchema.post("save", async function () {
  const product = await Product.findById(this.product);

  if (!product) return;

  const totalRating = product.rating * product.totalRatings + this.rating;
  const newAvg = totalRating / (product.totalRatings + 1);
  const data = {
    totalRatings: product.totalRatings + 1,
    rating: newAvg,
  };
  await Product.findByIdAndUpdate(product._id, data);

  return;
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
