const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');

const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// Route middleware params
// router.param('id', tourController.checkID);

// REVIEWS

// POST /tour/34324a/reviews
// GET  /tour/34324a/reviews
// GET  /tour/34324a/reviews/0498750a

router.use('/:tourId/reviews', reviewRouter);

// Add routes for aliasing -use middleware
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

// Routes
router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(authController.protect, tourController.createTour);

router
  .route('/:id')
  .get(authController.protect, tourController.getTour)
  .patch(authController.protect, tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'user'),
    tourController.deleteTour
  );

module.exports = router;
