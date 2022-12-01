const unknown = (request, response) => {
  response.status(404).send({ error: 'Not Found' });
};

module.exports = unknown;