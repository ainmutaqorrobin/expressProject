const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const catchAsyncError = require('../utils/catchAsyncError');

exports.getCheckoutSession = catchAsyncError(async (request, respond, next) => {
  //get current booked tour
  const tour = await Tour.findById(request.params.tourId);
  //create checkout session
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: `${request.protocol}://${request.get('host')}/`,
    cancel_url: `${request.protocol}://${request.get('host')}/tour/${
      tour.slug
    }`,
    customer_email: request.user.email,
    client_reference_id: request.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`http://localhost:8000/img/tours/${tour.imageCover}`],
          },
        },
        quantity: 1,
      },
    ],
  });
  
 respond.status(200).json({
    status: 'success',
    session,
  });
});
