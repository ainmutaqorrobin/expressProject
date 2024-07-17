const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const catchAsyncError = require('../utils/catchAsyncError');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsyncError(async (request, respond, next) => {
  //get current booked tour
  const tour = await Tour.findById(request.params.tourId);
  //create checkout session
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    //not secured url but temporary
    success_url: `${request.protocol}://${request.get('host')}/?tour=${
      request.params.tourId
    }&user=${request.user.id}&price=${tour.price}`,
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

exports.createBookingCheckout = catchAsyncError(
  async (request, respond, next) => {
    //temporary middleware (not secured)
    const { tour, user, price } = request.query;

    if (!tour && !user && !price) return next();
    await Booking.create({ tour, user, price });

    respond.redirect(request.originalUrl.split('?')[0]);
  }
);

exports.getAllBookings = factory.getAll(Booking);
exports.getSingleBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
