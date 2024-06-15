const AppError = require('../utils/appError');
const catchAsyncError = require('../utils/catchAsyncError');

exports.deleteOne = (Model) =>
  catchAsyncError(async (request, respond, next) => {
    const doc = await Model.findByIdAndDelete(request.params.id);

    if (!doc) {
      return next(new AppError(`Cannot found the model with that ID`, 404));
    }

    respond.status(204).json({
      status: `Successful deleted.`,
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsyncError(async (request, respond, next) => {
    const doc = await Model.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    respond.status(200).json({
      status: 'Succesfully updated.',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsyncError(async (request, respond, next) => {
    const doc = await Model.create(request.body);

    respond.status(201).json({
      status: 'Successfully created.',
      data: {
        data: doc,
      },
    });
  });
