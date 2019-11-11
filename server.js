const mongoose = require('mongoose');
const tourModel = require('./models/tourModel');
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
