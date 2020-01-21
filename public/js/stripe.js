import axios from 'axios';
import { showAlert } from './alert';

/* eslint-disable */
const stripe = Stripe('pk_test_CoiUwZu0VPLoZ8WiijlR0OJk00dCZn65pZ');

export const bookTour = async tourId => {
  try {
    // 1) Get the checkout session from the server API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    //console.log(session);

    // 2) Create checkout form  + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    //console.log(err);
    showAlert('error', err);
  }
};
