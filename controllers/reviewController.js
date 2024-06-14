const Review = require('../models/reviewModel');
const catchAsyncError = require('../utils/catchAsyncError');

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

exports.createReview = catchAsyncError(async (request, respond, next) => {
  //Nested routes
  if (!request.body.tour) {
    request.body.tour = request.params.tourId;
  }
  if (!request.body.user) {
    request.body.user = request.user.id;
  }
  const newReview = await Review.create(request.body);

  respond.status(201).json({
    status: 'Successfully created new review.',
    data: {
      newReview,
    },
  });
});
