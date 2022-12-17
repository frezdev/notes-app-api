require('./mongo');

const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const express = require('express');
const cors = require('cors');
const logger = require('../middleware/loggerMiddleware.js');
const notFound = require('../middleware/notFound.js');
const handleError = require('../middleware/handleError.js');
const Note = require('./models/Note');

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

Sentry.init({
  dsn: 'https://b08d1cce3e0149d9bb7b2cec6c3ad63f@o4504341181693952.ingest.sentry.io/4504341192835072',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.get('/', (request, response) => {
  response.send('<h1>NotesApp API</h1>');
});

// GET ALL NOTES
app.get('/api/notes', (request, response) => {
  Note.find({})
    .then(notes => {
      response.json(notes);
    });
});

// GET A NOTE
app.get('/api/notes/:id', (request, response, next) => {
  const { id } = request.params;
  Note.findById(id)
    .then(note => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    }).catch(err => {
      next(err);
    });
});

// UPDATE A NOTE
app.put('/api/notes/:id', (request, response, next) => {
  const { id } = request.params;
  const { body } = request;

  const updatedNote = {
    ...body
  };

  Note.findByIdAndUpdate(id, updatedNote, { new: true })
    .then((updated) => {
      response.json(updated);
      response.status(204).end();
    }).catch(err => next(err));
});

// DELETE A NOTE
app.delete('/api/notes/:id', (request, response, next) => {
  const { id } = request.params;

  Note.findByIdAndDelete(id)
    .then((deleted) => {
      response.json(deleted);
      response.status(204).end();
    }).catch(err => next(err));
});

// CREATE A NOTE
app.post('/api/notes', (request, response) => {
  const note = request.body;

  if (!note || !note.body || typeof note.body !== 'string') {
    return response.status(400).json({
      error: 'note.content is missing'
    });
  }

  const newNote = new Note({
    title: note.title,
    body: note.body,
    date: new Date()
  });

  newNote.save()
    .then(saveNote => {
      response.status(201).json(saveNote);
    });
});

app.use(Sentry.Handlers.errorHandler());

// NOT FOUND
app.use(notFound);

// ERROR RESPONSE
app.use(handleError);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
