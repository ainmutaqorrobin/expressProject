const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name.'],
  },
  email: {
    type: String,
    required: [true, 'Please enter user email.'],
    unique: true,
    validate: [validator.isEmail, 'This email is not valid'],
    lowercase: true,
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please enter user password.'],
    minlength: [6, 'A password must exceed than 6 characters'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please enter user password.'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
