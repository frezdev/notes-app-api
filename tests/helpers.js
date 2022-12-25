const supertest = require('supertest');
const { server } = require('../src/index.js');
const User = require('../src/models/User.js');

const api = supertest(server);

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

const getUsers = async () => {
  const usersDB = await User.find({});
  const usersAtStart = usersDB.map(user => user.toJSON());
  return usersAtStart;
};

module.exports = {
  getAllTitlesFromNotes,
  initialNotes,
  getUsers,
  api
};