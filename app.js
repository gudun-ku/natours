const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  console.log('using morgan for logging!');
  app.use(morgan('dev'));
}

app.use(express.json());

// STATIC FILES
app.use(express.static(`${__dirname}/public`));

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
