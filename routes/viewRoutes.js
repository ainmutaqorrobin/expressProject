const express = require('express');
const {
  getOverview,
  getTour,
  getLoginForm,
} = require('../controllers/viewController');
const router = express.Router();

router.get('/', getOverview);
router.get('/login', getLoginForm);
router.get('/tour/:slug', getTour);

module.exports = router;
