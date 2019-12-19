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
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

// Geo
router
  .route('/tours-within/:distance/center/:latlng/:unit')
  .get(tourController.getToursWithin);
// /tours-distance?distance=233&center=40,45&unit=mi
// /tours-within/233/center/-40,45/mi

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

// Routes
router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'user'),
    tourController.deleteTour
  );

module.exports = router;
