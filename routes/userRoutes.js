const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  createUser,
  getSingleUser,
  updateUserAdmin,
  deleteUser,
  updateUserSelf,
  deleteUserSelf,
} = require('../controllers/userController');

const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  checkAuthentication,
} = require('../controllers/authController');

router.post('/signup', signUp);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/updatePassword', checkAuthentication, updatePassword);
router.patch('/updateUserSelf', checkAuthentication, updateUserSelf);
router.delete('/deleteUserSelf', checkAuthentication, deleteUserSelf);
router.patch('/resetPassword/:token', resetPassword);

router.route('/').get(getAllUsers).post(createUser);
router
  .route('/:id')
  .get(getSingleUser)
  .patch(updateUserAdmin)
  .delete(deleteUser);

module.exports = router;
