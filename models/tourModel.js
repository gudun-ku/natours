const mongoose = require('mongoose');
// TOUR SCHEMA (MODEL)
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'a tour must have a name'],
    unique: true
  },
  price: { type: Number, required: [true, 'a tour must have a price'] },
  rating: { type: Number, default: 4.5 }
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
