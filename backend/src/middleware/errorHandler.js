function errorHandler(err, req, res, next) {
  console.error(err.stack || err);

  const status = err.statusCode || 500;
  const message = err.message || 'Something went wrong on our end';

  res.status(status).json({ message });
}

module.exports = errorHandler;
