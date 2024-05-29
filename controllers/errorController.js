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
    sendErrorProduction(error, respond);
  }
};
