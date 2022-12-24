const { mongoose } = require('mongoose');

const { server } = require('../src/index.js');
const {
  api,
  initialNotes,
  getAllTitlesFromNotes
} = require('./helpers');
const Note = require('../src/models/Note.js');

//jest.setTimeout(5000);


beforeEach(async () => {
  await Note.deleteMany({});

  // parallel
  // const notesObject = initialNotes.map(note => new Note(note));
  // const promises = notesObject.map(note => note.save);
  // await Promise.all(promises);

  // sequential
  for (const note of initialNotes) {
    const noteObject = new Note(note);
    await noteObject.save();
  }
});

describe('GET notes', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('there are two notes', async () => {
    const { response } = await getAllTitlesFromNotes();
    expect(response.body).toHaveLength(initialNotes.length);
  });

  test('the first note', async () => {
    const { titles } = await getAllTitlesFromNotes();

    expect(titles).toContain('Este es el titulo');
  });
});

describe('POST notes', () => {
  test('a valid note can be added', async () => {
    const newNote = {
      title: 'Creando otra nota',
      body: 'Este es un ejemplo de nota',
    };

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const { titles } = await getAllTitlesFromNotes();

    expect(titles).toHaveLength(initialNotes.length + 1);
  });

  test('note without content is not added', async () => {
    const newNote = {
      body: 'Este es un ejemplo de nota',
    };

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400);

    const { response } = await getAllTitlesFromNotes();

    expect(response.body).toHaveLength(initialNotes.length);
  });
});

describe('UPDATE note', () => {
  test('si la nota existe', async () => {
    const { response } = await getAllTitlesFromNotes();
    const { body: notes } = response;
    const noteToUpdate = notes[0];
    const updated = {
      ...noteToUpdate,
      title: 'Este es el titulo actualizado'
    };

    await api
      .put(`/api/notes/${noteToUpdate.id}`)
      .send(updated)
      .expect(200);

    const { titles } = await getAllTitlesFromNotes();
    expect(titles).toContain(updated.title);
  });
});

describe('DELETE notes', () => {
  test('a note can be deleted', async () => {
    const { response: firstResponse } = await getAllTitlesFromNotes();
    const { body: notes } = firstResponse;
    const noteToDelete = notes[0];

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204);

    const { response: secondResponse, titles } = await getAllTitlesFromNotes();
    expect(secondResponse.body).toHaveLength(initialNotes.length - 1);

    expect(titles).not.toContain(noteToDelete.title);
  });

  test('a note that do not exist can not be deleted', async () => {
    await api
      .delete('/api/notes/1234')
      .expect(400);

    const { response } = await getAllTitlesFromNotes();
    expect(response.body).toHaveLength(initialNotes.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});