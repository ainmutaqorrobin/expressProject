const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsyncError = require('../utils/catchAsyncError');
const factory = require('./handlerFactory');

const filteredObj = (object, ...requestFields) => {
  const newObject = {};
  Object.keys(object).forEach((element) => {
    if (requestFields.includes(element)) newObject[element] = object[element];
  });

  return newObject;
};

exports.getAllUsers = factory.getAll(User);
exports.getSingleUser = factory.getOne(User);
exports.updateUserAdmin = factory.updateOne(User);
exports.deleteUserAdmin = factory.deleteOne(User);

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
  respond.status(200).json({
    status: 'Success.',
    data: { user: updatedUser },
  });
});

exports.deleteUserSelf = catchAsyncError(async (request, respond, next) => {
  await User.findByIdAndUpdate(request.user.id, { active: false });

  respond.status(204).json({
    status: 'Success deactive.',
    data: null,
  });
});
