const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

// ============== HELPER function =============
const signToken = (id, authType) =>
  // returns a signed jwt
  jwt.sign({ id, authType }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// ============== HELPER function =============
const createAndSendToken = (res, user) => {
  // creates token and send response to user
  const token = signToken(user._id, user.authType);

  user.password = undefined;
  user.isActive = undefined;
  user.updatedAt = undefined;

  res.status(200).json({ status: "success", data: { user, token } });
};

// ============== REGISTER handler =============
module.exports.register = catchAsync(async (req, res, next) => {
  // create user in DB
  const user = await User.create(req.body);

  // sanitize fields
  user.password = undefined;
  user.isActive = undefined;
  user.updatedAt = undefined;

  // send response to user
  res.status(201).json({ status: "success", data: user });
});

// ============== LOGIN handler =============
module.exports.login = catchAsync(async (req, res, next) => {
  // get user email & password
  const { email, password } = req.body;

  // validation checks
  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }

  // find user in DB
  const user = await User.findOne({ email }).select("+password");

  // check password
  if (!user || !(await user.comparePasswords(password, user.password))) {
    return next(
      new AppError("Invalid credentials. Please check email or password", 400)
    );
  }

  // if each checks are passed then create and send token to user
  createAndSendToken(res, user);
});
