const Tour = require('./../models/tourModel');

// read the data file outside of the event loop
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

exports.checkID = (req, res, next, val) => {
  // small nice trick
  // const id = val * 1;
  // if (id > tours.length) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID'
  //   });
  // }
  // const tour = tours.find(el => el.id === id);
  // if (!tour) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID'
  //   });
  // }
  // next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid body: Missing name or price'
    });
  }
  next();
};

// ROUTE HANDLERS
exports.getAllTours = (req, res) => {
  // console.log(req.requestTime);
  // res.status(200).json({
  //   status: 'success',
  //   requestedAt: req.requestTime,
  //   results: tours.length,
  //   data: {
  //     tours
  //   }
  // });
};

exports.getTour = (req, res) => {
  // const id = req.params.id * 1;
  // const tour = tours.find(el => el.id === id);
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour
  //   }
  // });
};

exports.createTour = (req, res) => {
  //use middleware to put body in express request
  //console.log(req.body);
  // const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);
  // tours.push(newTour);
  // fs.writeFile(
  //   `${__dirname}\\dev-data\\data\\tours-simple.json`,
  //   JSON.stringify(tours),
  //   err => {
  //     if (err) res.status(500).send('Error saving tour!');
  //     res.status(201).json({
  //       status: 'success',
  //       data: {
  //         tour: newTour
  //       }
  //     });
  //   }
  // );
};

exports.updateTour = (req, res) => {
  // const id = req.params.id * 1;
  // const tour = tours.find(el => el.id === id);
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour: '<Updated tour here...>'
  //   }
  // });
};

exports.deleteTour = (req, res) => {
  // const id = req.params.id * 1;
  // const tour = tours.find(el => el.id === id);
  // res.status(204).json({
  //   status: 'success',
  //   data: null
  // });
};
