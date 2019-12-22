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

exports.getTour = catchAsync(async (req, res) => {
  // 1) Get the data for the requested tour, include reviews and guides
  const tour = await Tour.findOne({ slug: req.params.slug })
    .populate('reviews', {
      path: 'reviews',
      fields: 'review rating user'
    });
  console.log(tour.name);
  // 2) Build a template
  // 3) Render that template with data
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
});

