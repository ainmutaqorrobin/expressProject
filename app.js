const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const app = express();

//using middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//add limit API request to avoid brute force
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request, please try again after an hour.',
});

app.use('/api', limiter);
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((request, respond, next) => {
  request.requestTime = new Date().toISOString();
  console.log(request.headers);
  next();
});

//routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (request, respond, next) => {
  next(
    new AppError(`Cannot find ${request.originalUrl} path on this server.`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;
