const express = require('express');
const router = express.Router();
const {
  checkAuthentication,
  restrictTo,
} = require('../controllers/authController');

const {
  createReview,
  getAllReview,
} = require('../controllers/reviewController');

router
  .route('/')
  .get(getAllReview)
  .post(checkAuthentication, restrictTo('user'), createReview);

module.exports = router;
