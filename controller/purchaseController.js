const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Order = require("../model/order");
const Purchase = require("../model/purchase");

exports.markOrderAsDelivered = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.body.orderId);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  if (order.status === "delivered") {
    return next(new AppError("Order is already marked as delivered", 404));
  }

  order.status = "delivered";
  await order.save({ validateBeforeSave: false });

  const PurchasePromises = order.products.map((product) => {
    return Purchase.create({
      product: product.product,
      quantity: product.quantity,
      user: order.user,
    });
  });

  const purchases = await Promise.all[PurchasePromises];

  res.json({
    status: "success",
    purchases,
  });
});

exports.validPurchase = catchAsync(async (req, res, next) => {
  const purchase = await Purchase.find({
    user: req.user.id,
    product: req.body.product,
  });

  const productForReview = purchase.find((p) => p.isReviewed === false);

  if (!purchase || productForReview.isReviewed) {
    return next(new AppError("First Purchase Product", 404));
  }

  productForReview.isReviewed = true;

  await productForReview.save({ validateBeforeSave: false });

  next();
});

exports.reviewAllowed = catchAsync(async (req, res, next) => {
  //Check for user Logged in
  if (!req.user) {
    res.json({
      allowed: false,
    });
  }

  //check if user have bought a product or not
  const purchase = await Purchase.find({
    user: req.user.id,
    product: req.body.product,
  });

  //check if already reviewd or not
  const productForReview = purchase.find((p) => p.isReviewed === false);

  //not allowed if already reviewed
  if (!productForReview) {
    res.json({
      allowed: false,
    });
  }

  //allowed to review
  re.json({
    allowed: true,
  });
});
