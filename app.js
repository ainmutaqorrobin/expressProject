const express = require('express');
const morgan = require('morgan');
const app = express();

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
//using middleware
app.use(morgan('dev '));
app.use(express.json());
app.use((request, respond, next) => {
  console.log(`wassap geng its robin`);
  next();
});

app.use((request, respond, next) => {
  request.requestTime = new Date().toISOString();
  next();
});

//routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
