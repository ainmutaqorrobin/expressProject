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
  const tour = await Tour.findOne({ slug: request.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  respond.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
    tour,
  });
});
