const mongoose = require('mongoose');
const dotenv = require('dotenv');

// handle uncaught exceptions - before any code executes
process.on('uncaughtException', err => {
  console.log(`UNCAUGHT EXCEPTION!!! Shutting down ...`);
  console.log(err.name, err.message);
  process.exit(1);

});

// ENVIRONMENT VARIABLES
dotenv.config({
  path: './config.env'
});

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
  .then(() => console.log('DB connected succesfully!'))
  .catch(err => console.log(`Connection problem `, err.name, err.message));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});

// handle unhandled rejections
process.on('unhandledRejection', err => {
  console.log(`UNHANDLED REJECTION!!! Shutting down ...`);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});