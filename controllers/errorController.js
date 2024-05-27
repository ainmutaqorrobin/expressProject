//error handling middleware
module.exports = (error, request, respond, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'Error';

  respond.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};
