const Tour = require('../models/tourModel');

//method for get all tours
exports.getAllTours = async (request, respond) => {
  try {
    const tours = await Tour.find();

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
    respond.status(400).json({
      status: 'Failed to create new tour.',
      message: error,
    });
  }
};

//method for update tour
exports.updateTour = (request, respond) => {};

//method for delete tour
exports.deleteTour = (request, respond) => {
  respond.status(204).json({
    status: 'Success',
    data: null,
  });
};
