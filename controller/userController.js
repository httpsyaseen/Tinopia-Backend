const User = require("../model/user");
const catchAsync = require("../utils/catchAsync.js");

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    users,
  });
});
