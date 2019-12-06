module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; // internal server error
  err.status = err.status || 'Server error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
};
