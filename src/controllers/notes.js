const notesRouter = require('express').Router();
const Note = require('../models/Note.js');
const User = require('../models/User.js');

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
  });
  response.status(200).json(notes);
});

// GET A NOTE
notesRouter.get('/:id', (request, response, next) => {
  const { id } = request.params;
  Note.findById(id)
    .then(note => {
      if (note) return response.status(200).json(note);
      response.status(404).end();
    }).catch(err => {
      next(err);
    });
});

// CREATE A NOTE
notesRouter.post('/', async (request, response, next) => {
  const { body, title, userId } = request.body;

  const user = await User.findById(userId);

  if (!body || !title) {
    return response.status(400).json({
      error: 'note.content is missing'
    });
  }

  const newNote = new Note({
    title,
    body,
    date: new Date(),
    user: user._id
  });

  try {
    const saveNote = await newNote.save();

    user.notes = user.notes.concat(saveNote._id);
    await  user.save();

    response.status(201).json(saveNote);
  } catch (error) {
    next(error);
  }
});

// UPDATE A NOTE
notesRouter.put('/:id', (request, response, next) => {
  const { id } = request.params;
  const { body } = request;

  const updatedNote = {
    ...body
  };

  Note.findByIdAndUpdate(id, updatedNote, { new: true })
    .then((updated) => {
      response.status(200).json(updated).end();
    }).catch(err => next(err));
});

// DELETE A NOTE
notesRouter.delete('/:id', async (request, response, next) => {
  const { id } = request.params;

  try {
    const deleted = await Note.findByIdAndDelete(id);
    response.status(204).end();
    response.json(deleted);
  } catch (error) {
    next(error);
  }
});

module.exports = notesRouter;