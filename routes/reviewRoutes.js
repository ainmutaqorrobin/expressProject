const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  checkAuthentication,
  restrictTo,
} = require('../controllers/authController');

const {
  createReview,
  getAllReview,
  deleteReview,
  updateReview,
  setTourUserIds,
  getSingleReview,
} = require('../controllers/reviewController');

router
  .route('/')
  .get(getAllReview)
  .post(checkAuthentication, restrictTo('user'), setTourUserIds, createReview);

router
  .route('/:id')
  .get(getSingleReview)
  .delete(deleteReview)
  .patch(updateReview);

module.exports = router;
