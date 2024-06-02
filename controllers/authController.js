const User = require('../models/userModel');
const catchAsyncError = require('../utils/catchAsyncError');

exports.signUp = catchAsyncError(async (request, respond, next) => {
  const newUser = await User.create(request.body);

  respond.status(201).json({
    status: 'Successful.',
    message: 'Created new user.',
    data: {
      user: newUser,
    },
  });
});
