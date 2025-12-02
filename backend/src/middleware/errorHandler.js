function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  const status = err.status || 500;
  const error = err.message || 'Internal server error';
  const details = err.details || null;

  res.status(status).json({ error, details });
}

module.exports = errorHandler;
