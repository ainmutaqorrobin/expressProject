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
} = require('../controllers/reviewController');

router
  .route('/')
  .get(getAllReview)
  .post(checkAuthentication, restrictTo('user'), createReview);

router.route('/:id').delete(deleteReview)

module.exports = router;
