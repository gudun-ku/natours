const express = require('express');
const morgan = require('morgan');

const app = express();
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// MIDDLEWARES

app.use(morgan('dev'));

app.use(express.json());

//using our own middlewares
app.use((req, res, next) => {
  console.log('hello from the middleware!');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES MOUNTING

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
