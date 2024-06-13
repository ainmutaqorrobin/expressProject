const Review = require('../models/reviewModel');
const catchAsyncError = require('../utils/catchAsyncError');

exports.getAllReview = catchAsyncError(async (request, respond, next) => {
  const reviews = await Review.find();

  respond.status(200).json({
    status: 'Success',
    result: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsyncError(async (request, respond, next) => {
  const newReview = await Review.create(request.body);

  respond.status(201).json({
    status: 'Successfully created new review.',
    data: {
      newReview,
    },
  });
});
