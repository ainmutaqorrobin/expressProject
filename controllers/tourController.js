const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsyncError = require('../utils/catchAsyncError');
const factory = require('./handlerFactory');
const multer = require('multer');

const multerStorage = multer.memoryStorage();

const multerFilter = (request, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new AppError('Not an image! Please upload only images.', 400), false);
};

const imgUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImages = imgUpload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

//alias for get top tours
exports.aliasTopTours = (request, respond, next) => {
  request.query.limit = '5';
  request.query.sort = '-ratingsAverage,price';
  request.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.resizeTourImages = (request, respond, next) => {
  console.log(request.files);
  next();
};

exports.getAllTours = factory.getAll(Tour);
exports.getSingleTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

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

//will receive params /tours-within/233/center/34.111745,-118.113491/unit/mi
exports.getToursGeolocation = catchAsyncError(
  async (request, respond, next) => {
    const { distance, latlng, unit } = request.params;
    const [lat, lng] = latlng.split(',');
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    if (!lat || !lng) {
      next(
        new AppError(
          'Please provide latitude and longitude in format lat,lng',
          400
        )
      );
    }

    const tours = await Tour.find({
      startLocation: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radius],
        },
      },
    });

    respond.status(200).json({
      status: 'Success',
      results: tours.length,
      data: {
        data: tours,
      },
    });
  }
);

exports.getToursDistances = catchAsyncError(async (request, respond, next) => {
  const { latlng, unit } = request.params;
  const [lat, lng] = latlng.split(',');

  const converter = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in format lat,lng',
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [+lng, +lat],
        },
        distanceField: 'distance',
        distanceMultiplier: converter,
      },
    },
    {
      $project: {
        name: 1,
        distance: 1,
      },
    },
  ]);

  respond.status(200).json({
    status: 'Success',
    data: {
      data: distances,
    },
  });
});
