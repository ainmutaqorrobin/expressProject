const User = require('../models/userModel');
const catchAsyncError = require('../utils/catchAsyncError');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const { promisify } = require('util');

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = catchAsyncError(async (request, respond, next) => {
  const newUser = await User.create({
    name: request.body.name,
    email: request.body.email,
    password: request.body.password,
    passwordConfirm: request.body.passwordConfirm,
    passwordChangeAt: request.body.passwordChangeAt,
    role: request.body.role,
  });

  const token = signToken(newUser._id);

  respond.status(201).json({
    status: 'Successful.',
    message: 'Created new user.',
    token: token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsyncError(async (request, respond, next) => {
  const { email, password } = request.body;

  //Checking email and password is exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  //Checking user exist and password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.checkingPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //Sending token to client
  const token = signToken(user._id);

  console.log(user);
  respond.status(200).json({
    status: 'Success.',
    token: token,
  });
});

exports.checkAuthentication = catchAsyncError(
  async (request, respond, next) => {
    let token;
    //get token and check if there is a token
    if (
      request.headers.authorization &&
      request.headers.authorization.startsWith('Bearer')
    ) {
      token = request.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new AppError('You are not logged in, please login first!', 401)
      );
    }

    //verify token
    const decodedToken = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    //checking user is still exist
    const userFromToken = await User.findById(decodedToken.id);
    if (!userFromToken)
      return next(
        new AppError(
          'The token belonging to this user is no longer exist.',
          401
        )
      );

    //check if user changed password after token was sent
    if (userFromToken.changedPasswordAfter(decodedToken.iat)) {
      return next(
        new AppError('User recently changed password! Please login again.', 401)
      );
    }

    request.user = userFromToken;
    next();
  }
);

exports.restrictTo = (...roles) => {
  return (request, respond, next) => {
    if (!roles.includes(request.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};
