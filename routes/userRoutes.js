const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getSingleUser,
  updateUserAdmin,
  deleteUserAdmin,
  updateUserSelf,
  deleteUserSelf,
  getCurrentInfo,
  uploadUserPhoto,
} = require('../controllers/userController');

const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  checkAuthentication,
  restrictTo,
  logout,
} = require('../controllers/authController');

router.post('/signup', signUp);
router.get('/logout', logout);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

//use checkAuthentication handler as authentication middleware for remaining routes
router.use(checkAuthentication);

router.patch('/updatePassword', updatePassword);
router.patch('/updateUserSelf', uploadUserPhoto, updateUserSelf);
router.delete('/deleteUserSelf', deleteUserSelf);
router.route('/me').get(getCurrentInfo, getSingleUser);

//use restrictTo  handler as authorization middleware for remaining routes
router.use(restrictTo('admin'));

router.route('/').get(getAllUsers);
router
  .route('/:id')
  .get(getSingleUser)
  .patch(updateUserAdmin)
  .delete(deleteUserAdmin);

module.exports = router;
