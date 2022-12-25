const { info } = require('../utils/logger.js');

module.exports = (request, response, next) => {
  info('Method:', request.method);
  info('Path:', request.path);
  info('Body:', request.body);
  info('-------------');
  next();
};