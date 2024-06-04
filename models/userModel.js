const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please enter user password.'],
    validate: {
      //Only works on CREATE or SAVE.
      validator: function (value) {
        return value === this.password;
      },
      message: 'Passwords are not same.',
    },
  },
});

userSchema.pre('save', async function (next) {
  //Only run the function if password was actually modified.
  if (!this.isModified('password')) return next();

  //hashing password with salt of 12.
  this.password = await bcrypt.hash(this.password, 12);

  //removing passwordConfirm field.
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.checkingPassword = async function (
  enteredPassword,
  databasePassword
) {
  return await bcrypt.compare(enteredPassword, databasePassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
