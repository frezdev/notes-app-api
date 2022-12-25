const app = require('./app.js');
const http = require('http');
const { PORT } = require('../utils/config.js');
const { info } = require('../utils/logger.js');

const server = http.createServer(app);

server.listen(PORT, () => {
  info(`Server running on port ${PORT}`);
});

module.exports = { server };