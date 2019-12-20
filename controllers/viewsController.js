const catchAsync = require('./../utils/catchAsync');
const Tour = require('./../models/tourModel');


exports.getOvierview = catchAsync(async (req, res) => {
  // 1) Get Tour data from collection
  const tours = await Tour.find();

  // 2) Build a template
  // 3) Render that template using data from 1

  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour'
  });
};

