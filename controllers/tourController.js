const Tour = require('../models/tourModel');

//method for get all tours
exports.getAllTours = (request, respond) => {};

//method for get single tour
exports.getSingleTour = (request, respond) => {};

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
