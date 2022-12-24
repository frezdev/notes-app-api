const supertest = require('supertest');
const { app } = require('../src/index.js');
const api = supertest(app);

const initialNotes = [
  {
    title: 'Este es el titulo',
    body: 'Este es un ejemplo de nota',
  },
  {
    title: 'Este es otro titulo',
    body: 'Este es un ejemplo de nota',
  },
  {
    title: 'Nuevo titulo',
    body: 'Este es un ejemplo de nota',
  },
];

const getAllTitlesFromNotes = async () => {
  const response = await api.get('/api/notes');
  return {
    titles: response.body.map(note => note.title),
    response
  };
};

module.exports = {
  getAllTitlesFromNotes,
  initialNotes,
  api
};