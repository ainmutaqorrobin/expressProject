const { response } = require('express');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsyncError = require('../utils/catchAsyncError');
const AppError = require('../utils/appError');

//alias for get top tours
exports.aliasTopTours = (request, respond, next) => {
  request.query.limit = '5';
  request.query.sort = '-ratingsAverage,price';
  request.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

//method for get all tours
exports.getAllTours = catchAsyncError(async (request, respond, next) => {
  //execute query
  const features = new APIFeatures(Tour.find(), request.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();
  const tours = await features.query;

  respond.status(200).json({
    status: 'Success',
    result: tours.length,
    data: {
      tours,
    },
  });
});

//method for get single tour
exports.getSingleTour = catchAsyncError(async (request, respond, next) => {
  const tour = await Tour.findById(request.params.id);

  if (!tour) {
    return next(
      new AppError(`No tour found with ID ${request.params.id}`, 404)
    );
  }
  respond.status(200).json({
    status: 'Success',
    data: {
      tour,
    },
  });
});

//method for create new tour
exports.createTour = catchAsyncError(async (request, respond, next) => {
  const newTour = await Tour.create(request.body);

  respond.status(201).json({
    status: 'Successfull created new tour.',
    data: {
      tour: newTour,
    },
  });
});

//method for update tour
exports.updateTour = catchAsyncError(async (request, respond, next) => {
  const tour = await Tour.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    //mongoose will run again the validators every update
    runValidators: true,
  });
  if (!tour) {
    return next(
      new AppError(`No tour found with ID ${request.params.id}`, 404)
    );
  }
  respond.status(200).json({
    status: 'Successfull update tour.',
    data: {
      tour: tour,
    },
  });
});

//method for delete tour
exports.deleteTour = catchAsyncError(async (request, respond, next) => {
  const tour = await Tour.findByIdAndDelete(request.params.id);
  if (!tour) {
    return next(
      new AppError(`No tour found with ID ${request.params.id}`, 404)
    );
  }
  respond.status(204).json({
    status: 'Tour deleted successfully.',
  });
});

exports.getTourStats = catchAsyncError(async (request, respond, next) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numOfTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: {
          avgPrice: 1,
        },
      },
    ]);

    respond.status(200).json({
      status: 'Success',
      data: {
        stats,
      },
    });
  } catch (error) {
    respond.status(404).json({
      status: 'Failed to get tour stats',
      message: error,
    });
  }
});

exports.getMonthlyStats = catchAsyncError(async (request, respond, next) => {
  const year = +request.params.year;
  const plan = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numOfTours: { $sum: 1 },
        tours: {
          $push: '$name',
        },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numOfTours: -1,
      },
    },
  ]);

  respond.status(200).json({
    status: 'Success',
    data: {
      plan,
    },
  });
});
