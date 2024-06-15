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
