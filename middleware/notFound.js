module.exports = (request, response, next) => {
  response.status(404).end();
  next();
};