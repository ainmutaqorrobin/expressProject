const User = require('../models/userModel');
const catchAsyncError = require('../utils/catchAsyncError');
const jwt = require('jsonwebtoken');

exports.signUp = catchAsyncError(async (request, respond, next) => {
  const newUser = await User.create({
    name: request.body.name,
    email: request.body.email,
    password: request.body.password,
    passwordConfirm: request.body.passwordConfirm,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  respond.status(201).json({
    status: 'Successful.',
    message: 'Created new user.',
    token: token,
    data: {
      user: newUser,
    },
  });
});
