const User = require("../model/user");
const catchAsync = require("../utils/catchAsync.js");

exports.signup = catchAsync(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });
  res.status(201).json({
    status: "success",
    user,
  });
});
