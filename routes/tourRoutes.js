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

// router.param('id', validateID);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-stats/:year').get(getMonthlyStats);
router.route('/top-5-tours').get(aliasTopTours, getAllTours);
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getSingleTour).patch(updateTour).delete(deleteTour);

module.exports = router;
