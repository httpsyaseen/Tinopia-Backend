const User = require("../model/user");
const catchAsync = require("../utils/catchAsync.js");

exports.createUser = catchAsync(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;
  const base64Image = await req?.file?.buffer.toString("base64");
  const user = await User.create({
    name,
    email,
    password,
    photo: base64Image,
    passwordConfirm,
  });
  res.status(201).json({
    status: "success",
    user,
  });
});
