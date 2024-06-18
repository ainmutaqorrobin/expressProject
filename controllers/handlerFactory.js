const APIFeatures = require('../utils/apiFeatures');
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

exports.getOne = (Model, populateOptions) =>
  catchAsyncError(async (request, respond, next) => {
    let query = Model.findById(request.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    respond.status(200).json({
      status: 'Success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsyncError(async (request, respond, next) => {
    //for nested route get review from tour
    let filter;
    if (request.params.tourId) filter = { tour: request.params.tourId };

    const features = new APIFeatures(Model.find(filter), request.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();

    // const doc = await features.query.explain();
    const doc = await features.query;

    respond.status(200).json({
      status: 'Success',
      result: doc.length,
      data: {
        data: doc,
      },
    });
  });
