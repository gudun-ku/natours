const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// MIDDLEWARES

app.use(morgan('dev'));

app.use(express.json());

//using our own middleware
app.use((req, res, next) => {
  console.log('hello from the middleware!');
  next();
});

//using our own middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTE HANDLERS

// read the data file outside of the event loop
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}\\dev-data\\data\\tours-simple.json`)
);

const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
};

const getTour = (req, res) => {
  console.log(req.params);

  // small nice trick
  const id = req.params.id * 1;

  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  const tour = tours.find(el => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};

const createTour = (req, res) => {
  //use middleware to put body in express request
  //console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}\\dev-data\\data\\tours-simple.json`,
    JSON.stringify(tours),
    err => {
      if (err) res.status(500).send('Error saving tour!');

      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
};

const updateTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>'
    }
  });
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet!'
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet!'
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet!'
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet!'
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet!'
  });
};

// ROUTES

// Routers middleware
const tourRouter = express.Router();
const userRouter = express.Router();

// Routers mounting
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Routes
tourRouter
  .route('/')
  .get(getAllTours)
  .post(createTour);

tourRouter
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// USERS ROUTES

userRouter
  .route('/')
  .get(getAllUsers)
  .post(createUser);

userRouter
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// START SERVER

const port = 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
