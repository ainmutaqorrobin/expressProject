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

// router.param('id', validateID);
router.route('/').get(checkAuthentication, getAllTours).post(createTour);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-stats/:year').get(getMonthlyStats);
router.route('/top-5-tours').get(aliasTopTours, getAllTours);
router
  .route('/:id')
  .get(getSingleTour)
  .patch(updateTour)
  .delete(checkAuthentication, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
