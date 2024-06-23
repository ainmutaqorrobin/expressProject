const Tour = require('../models/tourModel');
const catchAsyncError = require('../utils/catchAsyncError');

exports.getOverview = catchAsyncError(async (request, respond, next) => {
  const tours = await Tour.find();

  respond.status(200).render('Overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsyncError(async (request, respond, next) => {
  respond.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
  });
});
