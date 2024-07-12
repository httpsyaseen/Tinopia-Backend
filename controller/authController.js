const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../model/user.js");
const catchAsync = require("../utils/catchAsync.js");
const AppError = require("../utils/appError.js");
const sendMail = require("../utils/email.js");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

const filterObj = (obj, ...allowed) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowed.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.restrictedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 401)
      );
    }
    next();
  };
};

exports.signup = catchAsync(async (req, res) => {
  const { name, email, password, passwordConfirm, role } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    role,
    passwordConfirm,
  });

  const data = {
    name: user.name,
    email: user.email,
    photo: user.photo,
  };

  const token = signToken(user._id);
  res.status(201).json({
    status: "success",
    token,
    user: data,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1. Check if email and password exits
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  //2. Check if user exists and password is correct
  const user = await User.findOne({ email }).select("+password");
  const correct = await user?.isPasswordCorrect(password, user.password);

  if (!correct || !user) {
    return next(new AppError("Incorrect email or password", 401));
  }

  //3.return token
  const token = signToken(user._id);

  const data = {
    name: user.name,
    email: user.email,
    photo: user.photo,
  };

  res.status(200).json({
    status: "success",
    token,
    user: data,
  });
});

exports.protectedRoute = catchAsync(async (req, res, next) => {
  //1. Get token and check if it exists
  let token;
  if (req.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    next(new AppError("Authorized Users Only", 401));
  }

  //2.Verify token and handle 2 Errors
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  //3. Check if user exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError("User does not exist", 401));
  }
  //4. is Pasword Changed After the jwt issues
  const changed = currentUser.isPasswordChangedAfterTokenExpires(decoded.iat);
  if (changed) {
    return next(new AppError("User recently changed password", 401));
  }

  req.user = currentUser;

  next();
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    next(new AppError("Please provide an email", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    next(new AppError("There is no user with that email", 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit your new passowrd to ${resetURL}/n  If you didn't forget your password, please ignore this email.`;
  try {
    await sendMail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });
  } catch (err) {
    console.log(err);
    return next(new AppError("There was an Error Sending the email,", 500));
  }

  res.json({
    status: "success",
    message: "Reset Link has been sent to email",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedLink = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetLink: hashedLink,
    passwordResetExpiresAt: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetExpiresAt = undefined;
  user.passwordResetLink = undefined;
  await user.save();

  const token = signToken(user._id);

  res.json({
    status: "success",
    token,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return next(
      new AppError("The user belonging to this token does not exist", 401)
    );
  }

  const correct = await user.isPasswordCorrect(
    req.body.oldPassword,
    user.password
  );
  if (!correct) {
    return next(new AppError("Your password is incorrect"), 401);
  }

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;

  await user.save();

  const newToken = signToken(user._id);

  res.json({
    status: "success",
    token: newToken,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("Another route defined for password"));
  }

  const data = filterObj(req.body, "name", "email");
  const updatedUser = await User.findByIdAndUpdate(req.user.id, data, {
    new: true,
    runValidators: true,
  });

  res.json({
    status: "success",
    user: updatedUser,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "sucess",
  });
});

exports.userInfo = catchAsync(async (req, res, next) => {
  const userData = await User.findById(req.user.id);
  const user = {
    name: userData.name,
    email: userData.email,
    photo: userData.photo,
  };

  res.status(200).json({
    status: "success",
    user,
  });
});
