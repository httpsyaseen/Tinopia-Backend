const Order = require("../model/order");
const User = require("../model/user");
const catchAsync = require("../utils/catchAsync");

exports.createOrder = catchAsync(async (req, res, next) => {
  const { productsList, totalCost } = req.body;

  console.log(req.body.productList);

  const user = await User.findById(req.user.id);

  const order = new Order({
    user: user._id,
    totalCost,
    products: productsList,
  });

  await order.save();

  res.json({
    status: "success",
    order,
  });
});

exports.getOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email") // Populate user details (optional)
    .populate({
      path: "products.product",
      select: "name price description", // Select fields to populate from Product schema
    });

  if (!order) {
    return next(new AppError("No order found with that ID", 404));
  }

  res.json({
    order,
  });
});

exports.getUserOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id }).populate({
    path: "products.product",
    select: "name price image ",
  });

  if (!orders) {
    return next(new AppError("No orders found for this user", 404));
  }

  res.json({
    status: "success",
    orders,
  });
});
