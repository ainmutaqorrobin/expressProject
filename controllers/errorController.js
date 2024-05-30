const AppError = require('../utils/appError');

const handleCastErrorDB = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldDB = (error) => {
  const key = Object.keys(error.keyValue).join('');
  const message = `${key} has duplicate value of '${error.keyValue[key]}'`;
  console.log(message);
  return new AppError(message, 400);
};

const handleValidationErrorDB = (error) => {
  const errors = Object.values(error.errors).map((val) => val.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

//error handling middleware
const sendErrorDev = (error, respond) => {
  respond.status(error.statusCode).json({
    status: error.status,
    error: error,
    message: error.message,
    stack: error.stack,
  });
};

const sendErrorProduction = (error, respond) => {
  //send the respond if user make wrong request
  if (error.isOperationalError) {
    respond.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    //send the formal respond if there are bug from the application itself
    console.error('ERROR ', error);
    respond.status(500).json({
      status: 'Error.',
      message: 'Something is wrong with the application.',
    });
  }
};

module.exports = (error, request, respond, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'Error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, respond);
  } else if (process.env.NODE_ENV === 'production') {
    let err = { ...error };
    if (error.name === 'CastError') err = handleCastErrorDB(err);
    if (error.code === 11000) err = handleDuplicateFieldDB(err);
    if (error.name === 'ValidationError') err = handleValidationErrorDB(err);
    sendErrorProduction(err, respond);
  }
};
