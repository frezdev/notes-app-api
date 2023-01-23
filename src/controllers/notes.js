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
notesRouter.get('/:id', async (request, response, next) => {
  const { id } = request.params;
  const note = await Note.findById(id).populate('user', {
    username: 1
  });

  try {
    if (note) return response.status(200).json(note);
  } catch (error) {
    response.status(404).end();
    next(error);
  }
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

  try {
    const newNote = new Note({
      title,
      body,
      date: new Date(),
      user: user._id
    });

    const saveNote = await newNote.save();

    user.notes = user.notes.concat(saveNote._id);
    await  user.save();

    response.status(201).json(saveNote);
  } catch (error) {
    response.status(400).json({
      error: 'Necesitas tener un usuario registrado'
    });
    next(error);
  }
});

// UPDATE A NOTE
notesRouter.put('/:id', async (request, response, next) => {
  const { id } = request.params;
  const { body } = request;

  const updatedNote = {
    ...body
  };

  try {
    const updated = await Note.findByIdAndUpdate(id, updatedNote, { new: true });
    response.status(200).json(updated).end();
  } catch (error) {
    next(error);
  }
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