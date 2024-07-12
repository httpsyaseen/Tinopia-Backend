const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    unique: true,
    low: true,
    required: [true, "Pleae provide an Email"],
    validate: [validator.isEmail, "Please Provide a valid email"],
  },

  password: {
    type: String,
    minlength: [8, "Password must be more than or equal to 8 characters"],
    required: [true, "Please provide a password"],
    select: false,
  },
  photo: String,
  passwordConfirm: {
    type: String,
    min: [8, "Password must be more than or equal to 8 characters"],
    required: [true, "Please Confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password Doesnot Match",
    },
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  passwordChangedAt: Date,
  passwordExpiresAt: Date,
  passwordResetLink: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
