const express = require('express');
const {
  getOverview,
  getTour,
  getLoginForm,
} = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', getOverview);
router.get('/login', getLoginForm);
router.get('/tour/:slug', getTour);

module.exports = router;
