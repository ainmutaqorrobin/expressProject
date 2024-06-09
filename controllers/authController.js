const User = require('../models/userModel');
const catchAsyncError = require('../utils/catchAsyncError');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const { promisify } = require('util');
const crypto = require('crypto');

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, respond) => {
  const token = signToken(user._id);

  respond.status(statusCode).json({
    status: 'Successful.',
    token: token,
    data: {
      user,
    },
  });
};

exports.signUp = catchAsyncError(async (request, respond, next) => {
  const newUser = await User.create({
    name: request.body.name,
    email: request.body.email,
    password: request.body.password,
    passwordConfirm: request.body.passwordConfirm,
    passwordChangeAt: request.body.passwordChangeAt,
    role: request.body.role,
  });
  createSendToken(newUser, 201, respond);
});

exports.login = catchAsyncError(async (request, respond, next) => {
  const { email, password } = request.body;

  //Checking email and password is exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  //Checking user exist and password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.checkingPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //Sending token to client
  createSendToken(user, 200, respond);
});

exports.checkAuthentication = catchAsyncError(
  async (request, respond, next) => {
    let token;
    //get token and check if there is a token
    if (
      request.headers.authorization &&
      request.headers.authorization.startsWith('Bearer')
    ) {
      token = request.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new AppError('You are not logged in, please login first!', 401)
      );
    }

    //verify token
    const decodedToken = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    //checking user is still exist
    const userFromToken = await User.findById(decodedToken.id);
    if (!userFromToken)
      return next(
        new AppError(
          'The token belonging to this user is no longer exist.',
          401
        )
      );

    //check if user changed password after token was sent
    if (userFromToken.changedPasswordAfter(decodedToken.iat)) {
      return next(
        new AppError('User recently changed password! Please login again.', 401)
      );
    }

    request.user = userFromToken;
    next();
  }
);

exports.restrictTo = (...roles) => {
  return (request, respond, next) => {
    if (!roles.includes(request.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsyncError(async (request, respond, next) => {
  //get user based on email
  const user = await User.findOne({ email: request.body.email });
  if (!user) {
    return next(new AppError('There is no user with the email address.', 404));
  }

  //generate random token for reset
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //send to email
  const resetURL = `${request.protocol}://${request.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with new password and confirm password to ${resetURL}.\nIf you didn't forget your password, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    respond.status(200).json({
      status: 'success',
      message: 'Token has been sent to email!',
    });
  } catch (error) {
    //reset password reset property if fail to send an email
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('There was an eror send an email', 500));
  }
});

exports.resetPassword = catchAsyncError(async (request, respond, next) => {
  //get user from token
  const hashedToken = crypto
    .createHash('sha256')
    .update(request.params.token)
    .digest('hex');

  //check token expired time and user existance, set new password
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = request.body.password;
  user.passwordConfirm = request.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //update changePasswordAt property for user

  createSendToken(user, 200, respond);
});

exports.updatePassword = catchAsyncError(async (request, respond, next) => {
  //get current user info
  const user = await User.findById(request.user.id).select('+password');

  //check if current password correct
  if (
    !(await user.checkingPassword(request.body.password, user.password))
  ) {
    return next(new AppError('Your new password is not same', 401));
  }

  //update new password
  user.password = request.body.newPassword;
  user.passwordConfirm = request.body.newPasswordConfirm;
  await user.save();

  //log user in, send JWT
  createSendToken(user, 200, respond);
});
