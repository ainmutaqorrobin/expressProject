import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { showAlert } from './alerts';

const stripePromise = loadStripe(
  'pk_test_51Pb5cTJ4tUJffrKJQFNtclmfogx4sljslOxfJ4DQXUcII72HEr9OF6wk38VaJaIzlmVZeFqw5t0goxQxmboYeZC600n8zYE75H'
);

export const bookTour = async (tourId) => {
  try {
    // Get checkout session from backend
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // Initialize Stripe.js
    const stripe = await stripePromise;

    // Redirect to checkout
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    console.log(error);
    showAlert('error', error);
  }
};
