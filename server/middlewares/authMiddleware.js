const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

module.exports.protect = catchAsync(async (req, res, next) => {
  // allows access to only signed users
  let token;

  // get token from request headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // verify jwt
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // find current user from jwt id
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  req.user = currentUser;
  next();
});

// ============== MIDDLEWARE =============
module.exports.restrictTo = (...roles) => {
  // allows role based access to users
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};
