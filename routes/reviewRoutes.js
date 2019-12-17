const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// MERGE PARAMS WITH OTHER ROUTERS TO PROVIDE NESTED ROUTES
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(authController.protect, reviewController.createReview);

router.route('/:id').get(reviewController.getReview);

module.exports = router;
