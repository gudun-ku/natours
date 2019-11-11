const mongoose = require('mongoose');
const dotenv = require('dotenv');

// ENVIRONMENT VARIABLES
dotenv.config({ path: './config.env' });
const app = require('./app');

//console.log(app.get('env'));
//console.log(process.env);

const DB = process.env.DATABASE.replace(
  '<USERNAME>',
  process.env.DATABASE_USER
).replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection succesful!'));

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

const testTour = new Tour({
  name: 'The Park Camper',
  price: 297
});

testTour
  .save()
  .then(doc => {
    console.log(doc);
  })
  .catch(err => {
    console.log('ERROR: ', err);
  });
// START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
