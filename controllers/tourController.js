const Tour = require('../models/tourModel');

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
    //copy request query using spread operator
    const requestQuery = { ...request.query };
    const excludeQuery = ['page', 'sort', 'limit', 'fields'];

    //filtered the query by delete if the excludeQuery exist in requestQuery
    excludeQuery.forEach((el) => delete requestQuery[el]);

    //advanced filtering
    let queryString = JSON.stringify(requestQuery);
    queryString = queryString.replace(
      /\b(gte|lte|gt|lt)\b/g,
      (word) => `$${word}`
    );
    let query = Tour.find(JSON.parse(queryString));

    if (request.query.sort) {
      //if have multiple sorting query
      const multiQuerySort = request.query.sort.split(',').join(' ');
      query = query.sort(multiQuerySort);
    } else {
      //default sorting
      query = query.sort('-createdAt');
    }

    //projecting query
    if (request.query.fields) {
      const fields = request.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    //pagination
    if (request.query.limit) {
      const page = +request.query.page || 1;
      const limit = +request.query.limit || 10;
      const skip = (page - 1) * limit;
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist.');
      query = query.skip(skip).limit(limit);
    }

    //execute query
    const tours = await query;

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
