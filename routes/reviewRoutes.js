const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// MERGE PARAMS WITH OTHER ROUTERS TO PROVIDE NESTED ROUTES
const router = express.Router({ mergeParams: true });

// protects all routes after this string
router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;
