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
} = require('../controllers/reviewController');

router
  .route('/')
  .get(getAllReview)
  .post(checkAuthentication, restrictTo('user'), setTourUserIds, createReview);

router.route('/:id').delete(deleteReview).patch(updateReview);

module.exports = router;
