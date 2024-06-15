const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

// exports.getAllReview = catchAsyncError(async (request, respond, next) => {
//   let filter;
//   if (request.params.tourId) {
//     filter = { tour: request.params.tourId };
//   }
//   const reviews = await Review.find(filter);

//   respond.status(200).json({
//     status: 'Success',
//     result: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });

exports.getAllReview = factory.getAll(Review);

exports.setTourUserIds = (request, respond, next) => {
  //for nested route
  if (!request.body.tour) request.body.tour = request.params.tourId;
  if (!request.body.user) request.body.user = request.user.id;
  next();
};

exports.getSingleReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
