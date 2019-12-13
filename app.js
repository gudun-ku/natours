const express = require('express');
const morgan = require('morgan');
// query rate limiting for login and signup
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// per HOUR!
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour'
});

app.use('/api', limiter);

app.use(express.json());

// STATIC FILES
app.use(express.static(`${__dirname}/public`));

//using our own middlewares
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES MOUNTING

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// NO ONE ROUTER HAS BEEN CATCHED - THAT NEED TO BE AFTER EACH ROUTE OF OUR APP
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Errors handling
app.use(globalErrorHandler);

module.exports = app;
