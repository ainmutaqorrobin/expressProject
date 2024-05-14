const express = require('express');
const router = express.Router();

const getAllUsers = (request, respond) => {
  respond.status(500).json({
    status: 'Error',
    message: 'This route is not yet implemented.',
  });
};
const getSingleUser = (request, respond) => {
  respond.status(500).json({
    status: 'Error',
    message: 'This route is not yet implemented.',
  });
};
const createUser = (request, respond) => {
  respond.status(500).json({
    status: 'Error',
    message: 'This route is not yet implemented.',
  });
};
const updateUser = (request, respond) => {
  respond.status(500).json({
    status: 'Error',
    message: 'This route is not yet implemented.',
  });
};
const deleteUser = (request, respond) => {
  respond.status(500).json({
    status: 'Error',
    message: 'This route is not yet implemented.',
  });
};

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getSingleUser).patch(updateUser).delete(deleteUser);

module.exports = router;
