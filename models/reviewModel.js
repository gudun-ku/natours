const mongoose = require('mongoose');
const Tour = require('./tourModel');

// REVIEW SCHEMA (MODEL)
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
      trim: true,
      minlength: [40, 'A review must have more than 40 characters']
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1'],
      max: [5, 'Rating must be below 5.0']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
  this.populate({ path: 'user', select: 'name photo' });
  next();
});

// Static method for calculating rating stats for tour
reviewSchema.statics.calcAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  //console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

// POST - renew stats on new review creation
reviewSchema.post('save', function() {
  // this points to current doc - review
  // we need to initialize current doc so use constructor
  this.constructor.calcAverageRatings(this.tour);
});

// FindByIdAndUpdate
// FindByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function(next) {
  // r to post function
  this.r = await this.findOne();
  next();
});

// We're passing data from pre middleware to post middleware with r var
reviewSchema.post(/^findOneAnd/, async function() {
  // await this.findOne() does NOT work here, query has already executed
  if (this.r) {
    await this.r.constructor.calcAverageRatings(this.r.tour);
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
