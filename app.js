const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const app = express();

//using middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((request, respond, next) => {
  request.requestTime = new Date().toISOString();
  next();
});

//routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (request, respond, next) => {
  const error = new Error(
    `Cannot find ${request.originalUrl} path on this server.`
  );
  (error.status = 'Failed'), (error.statusCode = 404);
  next(error);
});

//error handling middleware
app.use((error, request, respond, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'Error';

  respond.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
});
module.exports = app;
