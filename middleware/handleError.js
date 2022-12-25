const logger = require('../utils/logger.js');

module.exports = (error, _request, response, next ) => {
  logger.error(error.name);

  if (error.name === 'CastError') {
    return response.status(400).send({
      error: 'malformatted id'
    });
  } else if (error.name === 'ValidationError') {
    return response.status(500).end();
  }

  next(error);
};

