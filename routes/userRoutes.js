const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

router.post('/signup', signUp);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getSingleUser).patch(updateUser).delete(deleteUser);

module.exports = router;
