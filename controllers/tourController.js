const Tour = require('../models/tourModel');

//method for get all tours
exports.getAllTours = async (request, respond) => {
  try {
    //copy request query using spread operator
    const requestQuery = { ...request.query };
    const excludeQuery = ['page', 'sort', 'limit', 'field'];

    //filtered the query by delete if the excludeQuery exist in requestQuery
    excludeQuery.forEach((el) => delete requestQuery[el]);
    const query = Tour.find(requestQuery);

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
