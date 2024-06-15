const Review = require('../models/reviewModel');
const catchAsyncError = require('../utils/catchAsyncError');
const factory = require('./handlerFactory');

exports.getAllReview = catchAsyncError(async (request, respond, next) => {
  let filter;
  if (request.params.tourId) {
    filter = { tour: request.params.tourId };
  }
  const reviews = await Review.find(filter);

  respond.status(200).json({
    status: 'Success',
    result: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.setTourUserIds = (request, respond, next) => {
  //for nested route
  if (!request.body.tour) request.body.tour = request.params.tourId;
  if (!request.body.user) request.body.user = request.user.id;
  next();
};

exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
