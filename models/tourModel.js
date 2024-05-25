const mongoose = require('mongoose');
const slugify = require('slugify');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name.'],
      unique: true,
      trim: true,
    },
    slug: { type: String },
    duration: { type: Number, required: [true, 'A tour must have duration.'] },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have group size.'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have difficulty.'],
    },
    ratingsAverage: { type: Number, default: 4.5 },
    ratingsQuantity: { type: Number, default: 0 },
    price: { type: Number, required: [true, 'A tour must have a price'] },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have summary'],
    },
    description: { type: String, trim: true },
    imageCover: {
      type: String,
      required: [true, 'A tour must have cover image.'],
    },
    images: [String],
    createdAt: { type: Date, default: Date.now(), select: false },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationInWeeks').get(function () {
  return this.duration / 7;
});

//DOCUMENT MIDDLEWARE (this middleware only execute when saving/adding document)
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('Saving document...');
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE (this middleware only execute when performing query)
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (document, next) {
  console.log(`Query tooks  + ${Date.now() - this.start}  miliseconds`);
  console.log(document);
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
