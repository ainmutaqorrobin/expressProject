const AppError = require('../utils/appError');

const handleCastErrorDB = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldDB = (error) => {
  const key = Object.keys(error.keyValue).join('');
  const message = `${key} has duplicate value of '${error.keyValue[key]}'`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (error) => {
  const errors = Object.values(error.errors).map((val) => val.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = (error) =>
  new AppError('Invalid token. Please login again!', 401);

const handleTokenExpiredError = (error) =>
  new AppError('Your token has expired! Please login back again!', 401);

//error handling middleware
const sendErrorDev = (error, request, respond) => {
  //API error
  if (request.originalUrl.startsWith('/api')) {
    return respond.status(error.statusCode).json({
      status: error.status,
      error: error,
      message: error.message,
      stack: error.stack,
    });
  }
  //render error page
  return respond.status(error.statusCode).render('error', {
    title: 'Something went wrong!',
    message: error.message,
  });
};

const sendErrorProduction = (error, request, respond) => {
  //API error
  if (request.originalUrl.startsWith('/api')) {
    if (error.isOperationalError) {
      return respond.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    }
    //send the formal respond if there are bug from the application itself
    console.error('ERROR ', error);

    //send the respond if unknown error
    return respond.status(500).json({
      title: 'error',
      message: 'Please try again later.',
    });
  }
  //render error page
  if (error.isOperationalError) {
    console.log(error);
    return respond.status(error.statusCode).render('error', {
      title: 'Something went wrong!',
      message: error.message,
    });
  }

  console.error('ERROR ', error);
  return respond.status(error.statusCode).render('error', {
    title: 'Something went wrong!',
    message: 'Please try again later',
  });
};

module.exports = (error, request, respond, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'Error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, request, respond);
  } else if (process.env.NODE_ENV === 'production') {
    let err = { ...error };
    err.message = error.message;
    if (error.name === 'CastError') err = handleCastErrorDB(err);
    if (error.code === 11000) err = handleDuplicateFieldDB(err);
    if (error.name === 'ValidationError') err = handleValidationErrorDB(err);
    if (error.name === 'JsonWebTokenError') err = handleJWTError(err);
    if (error.name === 'TokenExpiredError') err = handleTokenExpiredError(err);

    sendErrorProduction(err, request, respond);
  }
};
