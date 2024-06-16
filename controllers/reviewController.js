const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.setTourUserIds = (request, respond, next) => {
  //for nested route
  if (!request.body.tour) request.body.tour = request.params.tourId;
  if (!request.body.user) request.body.user = request.user.id;
  next();
};

exports.getAllReview = factory.getAll(Review);
exports.getSingleReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
