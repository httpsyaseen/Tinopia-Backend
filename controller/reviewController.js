const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Review = require("../model/review");

exports.createReview = catchAsync(async (req, res, next) => {
  const review = await Review.create({
    review: req.body.review,
    rating: req.body.rating,
    user: req.user.id,
    product: req.body.product,
  });

  res.json({
    status: "success",
    review,
  });
});

exports.getProductReview = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate("user", "name photo")
    .sort({ reviewDate: -1 });

  if (!reviews) {
    return next(new AppError("No reviews found", 404));
  }

  res.json({
    status: "success",
    reviews,
  });
});
