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

router.use(checkAuthentication);

router
  .route('/')
  .get(getAllReview)
  .post(restrictTo('user'), setTourUserIds, createReview);

router
  .route('/:id')
  .get(getSingleReview)
  .delete(restrictTo('user', 'admin'), deleteReview)
  .patch(restrictTo('user', 'admin'), updateReview);

module.exports = router;
