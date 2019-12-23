const path = require('path');
const express = require('express');
const morgan = require('morgan');
// query rate limiting for login and signup
const rateLimit = require('express-rate-limit');
// secure http headers
const helmet = require('helmet');
// sanitization
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
// prevent parameters pollution
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

// view (our wwwsite) routes
const viewRouter = require('./routes/viewRoutes');

const app = express();

// use PUG
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same IP address
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour'
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
// Url encoded for web forms
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// Cookie parser for login by session cookie
app.use(cookieParser());

// Data sanitization against NoSQL query injections
app.use(mongoSanitize());
// Data sanitization against XSS attack
app.use(xss());
// Prevent http query parameters pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Test - using our own test middlewares
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.cookies);
  next();
});

// ROUTES MOUNTING
// WWW ROUTES
app.use('/', viewRouter);
// API ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// NO ONE ROUTER HAS BEEN CATCHED - THAT NEED TO BE AFTER EACH ROUTE OF OUR APP
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Errors handling
app.use(globalErrorHandler);

module.exports = app;
