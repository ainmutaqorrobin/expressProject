const express = require('express');
const router = express.Router();
const {
  getAllTours,
  createTour,
  getSingleTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyStats,
} = require('../controllers/tourController');
const {
  checkAuthentication,
  restrictTo,
} = require('../controllers/authController');

const reviewRouter = require('../routes/reviewRoutes');

router.use('/:tourId/reviews', reviewRouter);

// router.param('id', validateID);
router
  .route('/')
  .get(getAllTours)
  .post(checkAuthentication, restrictTo('admin', 'lead-guide'), createTour);

router.route('/tour-stats').get(getTourStats);

router
  .route('/monthly-stats/:year')
  .get(
    checkAuthentication,
    restrictTo('admin', 'lead-guide', 'guide'),
    getMonthlyStats
  );

router.route('/top-5-tours').get(aliasTopTours, getAllTours);

router
  .route('/:id')
  .get(getSingleTour)
  .patch(checkAuthentication, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(checkAuthentication, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
