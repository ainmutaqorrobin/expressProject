const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const app = express();
const cookieParser = require('cookie-parser');
const compression = require('compression');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//read static file
app.use(express.static(path.join(__dirname, 'public')));

//to make HTTP Header secured
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'data:', 'blob:'],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'data:'],
      scriptSrc: ["'self'", 'https://*.cloudflare.com'],
      scriptSrc: ["'self'", 'https://*.stripe.com'],
      scriptSrc: ["'self'", 'http:', 'https://*.mapbox.com', 'data:'],
      frameSrc: ["'self'", 'https://*.stripe.com'],
      objectSrc: ["'none'"],
      styleSrc: ["'self'", 'https:', 'unsafe-inline'],
      workerSrc: ["'self'", 'data:', 'blob:'],
      childSrc: ["'self'", 'blob:'],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'", 'blob:', 'https://*.mapbox.com'],
      upgradeInsecureRequests: [],
    },
  })
);

//development logging
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

//body parser, reading data from body into request body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use(compression());

//test middleware
app.use((request, respond, next) => {
  request.requestTime = new Date().toISOString();
  next();
});

//routes

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (request, respond, next) => {
  next(
    new AppError(`Cannot find ${request.originalUrl} path on this server.`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;
