const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

// MERGE PARAMS WITH OTHER ROUTERS TO PROVIDE NESTED ROUTES
const router = express.Router();

router.get(
  '/checkout-session/:tourID',
  authController.protect,
  bookingController.getCheckoutSession
);

module.exports = router;
