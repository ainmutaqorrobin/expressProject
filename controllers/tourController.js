const { response } = require('express');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

//alias for get top tours
exports.aliasTopTours = (request, respond, next) => {
  request.query.limit = '5';
  request.query.sort = '-ratingsAverage,price';
  request.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

//method for get all tours
exports.getAllTours = async (request, respond) => {
  try {
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
  } catch (error) {
    respond.status(404).json({
      status: 'Failed',
      message: error,
    });
  }
};

//method for get single tour
exports.getSingleTour = async (request, respond) => {
  try {
    const tour = await Tour.findById(request.params.id);
    respond.status(200).json({
      status: 'Success',
      data: {
        tour,
      },
    });
  } catch (error) {
    respond.status(404).json({
      status: 'Failed',
      message: error,
    });
  }
};

//method for create new tour
exports.createTour = async (request, respond) => {
  try {
    const newTour = await Tour.create(request.body);

    respond.status(201).json({
      status: 'Successfull created new tour.',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    respond.status(404).json({
      status: 'Failed to create new tour.',
      message: error,
    });
  }
};

//method for update tour
exports.updateTour = async (request, respond) => {
  try {
    const tour = await Tour.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
      runValidators: true,
    });
    respond.status(200).json({
      status: 'Successfull update tour.',
      data: {
        tour: tour,
      },
    });
  } catch (error) {
    respond.status(404).json({
      status: 'Failed to update tour.',
      message: error,
    });
  }
};

//method for delete tour
exports.deleteTour = async (request, respond) => {
  try {
    await Tour.findByIdAndDelete(request.params.id);
    respond.status(204).json({
      status: 'Tour deleted successfully.',
    });
  } catch (error) {
    respond.status(404).json({
      status: 'Failed to delete tour',
      message: error,
    });
  }
};

exports.getTourStats = async (request, respond) => {
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
};

exports.getMonthlyStats = async (request, respond) => {
  try {
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
  } catch (error) {
    respond.status(404).json({
      status: 'Failed to get monthly stats',
      message: error,
    });
  }
};
