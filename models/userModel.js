const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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
  role: {
    type: String,
    enum: ['admin', 'user', 'guide', 'lead-guide'],
    default: 'user',
  },
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
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

//=========================== COMMENT THIS MIDDLEWARE BEFORE IMPORTING USERS DUMMY DATA ===========================
userSchema.pre('save', async function (next) {
  //Only run the function if password was actually modified.
  if (!this.isModified('password')) return next();

  //hashing password with salt of 12.
  this.password = await bcrypt.hash(this.password, 12);

  //removing passwordConfirm field.
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  //minus 1 seconds to prevent delay in sign token
  this.passwordChangeAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
//=========================== COMMENT THIS MIDDLEWARE BEFORE IMPORTING USERS DUMMY DATA ===========================

userSchema.methods.checkingPassword = async function (
  enteredPassword,
  databasePassword
) {
  return await bcrypt.compare(enteredPassword, databasePassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangeAt) {
    const changedTimestamp = +this.passwordChangeAt.getTime() / 1000;
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  //expired within 10 minutes
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
