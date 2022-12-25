const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  MONGO_URI: process.env.MONGO_URI,
  MONGO_URI_TEST: process.env.MONGO_URI_TEST,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || 3001
};
