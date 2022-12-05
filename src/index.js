require('./mongo');

const express = require('express');
const cors = require('cors');
const logger = require('../utils/loggerMiddelware.js');
const unknown = require('../utils/unknownMiddelware.js');
const Note = require('./models/Note');

const app = express();

app.use(cors());
app.use(express.json());

app.use(logger);


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
    date: new Date().toUTCString()
  });

  newNote.save()
    .then(saveNote => {
      response.status(201).json(saveNote);
    });
});

// ERROR RESPONSE
app.use(unknown);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
