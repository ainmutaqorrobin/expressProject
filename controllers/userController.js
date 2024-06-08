const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsyncError = require('../utils/catchAsyncError');

const filteredObj = (object, ...requestFields) => {
  const newObject = {};
  Object.keys(object).forEach((element) => {
    if (requestFields.includes(element)) newObject[element] = object[element];
  });

  return newObject;
};

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

exports.updateUserAdmin = (request, respond) => {
  respond.status(500).json({
    status: 'Error',
    message: 'This route is not yet implemented.',
  });
};

exports.updateUserSelf = catchAsyncError(async (request, respond, next) => {
  //if user send password to update will prompt error
  if (request.body.password || request.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /api/v1/users/updatePassword',
        400
      )
    );
  }
  const filteredBody = filteredObj(request.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(
    request.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );
  console.log(filteredBody);
  console.log(updatedUser);
  respond.status(200).json({
    status: 'Success.',
    filteredBody: filteredBody,
    data: { user: updatedUser },
  });
});

exports.deleteUser = (request, respond) => {
  respond.status(500).json({
    status: 'Error',
    message: 'This route is not yet implemented.',
  });
};
