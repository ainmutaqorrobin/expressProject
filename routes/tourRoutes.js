const express = require('express');
const router = express.Router();
const {
  getAllTours,
  createTour,
  getSingleTour,
  updateTour,
  deleteTour,
  validateID,checkBodyRequest
} = require('../controllers/tourController');

router.param('id', validateID);
router.route('/').get(getAllTours).post(checkBodyRequest,createTour);
router.route('/:id').get(getSingleTour).patch(updateTour).delete(deleteTour);

module.exports = router;
