require('./mongo');

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

app.get('/', (request, response) => {
  response.send('<h1>NotesApp API</h1>');
});

// GET ALL NOTES
app.get('/api/notes', async (request, response) => {
  const notes = await Note.find({});
  response.json(notes);
});

// GET A NOTE
app.get('/api/notes/:id', (request, response, next) => {
  const { id } = request.params;
  Note.findById(id)
    .then(note => {
      if (note) return response.json(note);
      response.status(404).end();
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
      response.status(200).end();
    }).catch(err => next(err));
});

// DELETE A NOTE
app.delete('/api/notes/:id', async (request, response, next) => {
  const { id } = request.params;

  try {
    const deleted = await Note.findByIdAndDelete(id);
    response.status(204).end();
    response.json(deleted);
  } catch (error) {
    next(error);
  }
});

// CREATE A NOTE
app.post('/api/notes', async (request, response, next) => {
  const note = request.body;

  if (!note || !note.body || typeof note.body !== 'string' || !note.title) {
    return response.status(400).json({
      error: 'note.content is missing'
    });
  }

  const newNote = new Note({
    title: note.title,
    body: note.body,
    date: new Date()
  });

  try {
    const saveNote = await newNote.save();
    response.status(201).json(saveNote);
  } catch (error) {
    next(error);
  }
});


// NOT FOUND
app.use(notFound);

// ERROR RESPONSE
app.use(handleError);

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server };