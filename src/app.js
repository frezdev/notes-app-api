const express = require('express');
const cors = require('cors');
const mongoDbConnect = require('./mongo.js');
const app = express();
const notesRouter = require('./controllers/notes.js');
const usersRouter = require('./controllers/users.js');
const notFound = require('../middleware/notFound.js');
const handleError = require('../middleware/handleError.js');
const requestLogger = require('../middleware/requestLogger.js');

// Connection to DB
mongoDbConnect();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(requestLogger);

app.use('/api/notes', notesRouter);
app.use('/api/users', usersRouter);

// NOT FOUND
app.use(notFound);

// ERROR RESPONSE
app.use(handleError);

module.exports = app;