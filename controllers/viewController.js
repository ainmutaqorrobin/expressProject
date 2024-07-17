const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsyncError = require('../utils/catchAsyncError');

exports.getOverview = catchAsyncError(async (request, respond, next) => {
  const tours = await Tour.find();

  respond.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsyncError(async (request, respond, next) => {
  const tour = await Tour.findOne({ slug: request.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) return next(new AppError('There is no tour found.', 404));

  respond.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});

exports.getLoginForm = (request, respond, next) => {
  respond.status(200).render('login', { title: 'Login' });
};

exports.getAccount = (request, respond) => {
  respond.status(200).render('account', {
    title: 'Your account',
  });
};

exports.getmyTours = catchAsyncError(async (request, respond, next) => {
  const bookings = await Booking.find({ user: request.user.id });
  const tourIDs = bookings.map((element) => element.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });
  respond.status(200).render('overview', { title: 'My Tours', tours });
});
