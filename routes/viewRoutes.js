const express = require('express');
const {
  getOverview,
  getTour,
  getLoginForm,
  getAccount,
  getmyTours,
} = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  getOverview
);
router.get('/login', authController.isLoggedIn, getLoginForm);
router.get('/tour/:slug', authController.isLoggedIn, getTour);
router.get('/me', authController.checkAuthentication, getAccount);
router.get('/my-tours', authController.checkAuthentication, getmyTours);

module.exports = router;
