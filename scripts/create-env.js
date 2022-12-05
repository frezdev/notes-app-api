const fs = require('fs');

fs.writeFileSync('./.env', `MONGO_URI=${process.env.MONGO_URI}\n`);