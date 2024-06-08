const User = require('../models/userModel');
const catchAsyncError = require('../utils/catchAsyncError');

exports.getAllUsers = catchAsyncError(async (request, respond) => {
  //execute query
  const users = await User.find();

  respond.status(200).json({
    status: 'Success',
    result: users.length,
    data: {
      users,
    },
  });
});
exports.getSingleUser = (request, respond) => {
  respond.status(500).json({
    status: 'Error',
    message: 'This route is not yet implemented.',
  });
};
exports.createUser = (request, respond) => {
  respond.status(500).json({
    status: 'Error',
    message: 'This route is not yet implemented.',
  });
};
exports.updateUser = (request, respond) => {
  respond.status(500).json({
    status: 'Error',
    message: 'This route is not yet implemented.',
  });
};
exports.deleteUser = (request, respond) => {
  respond.status(500).json({
    status: 'Error',
    message: 'This route is not yet implemented.',
  });
};
