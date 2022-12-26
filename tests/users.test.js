const mongoose = require('mongoose');
const { server } = require('../src/index.js');
const User = require('../src/models/User.js');
const { api, getUsers } = require('./helpers');

//jest.setTimeout(9000);

beforeEach(async () => {
  await User.deleteMany({});

  const user = new User({
    username: 'andcoder',
    name: 'Andres',
    lastname: 'Fontalvo',
    passwordHash: 'contraseña'
  },);
  await user.save();
});

describe('Creating a new user', () => {
  test('works as expected creating a fresh username', async () => {
    const usersAtStart = await getUsers();

    const newUser = {
      username: 'fabimona',
      name: 'Fabiana',
      lastname: 'Fontalvo',
      password: 'Contraseña'
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await getUsers();

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map(user => user.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails with proper statuscode and message if username is already taken', async () => {
    const usersAtStart = await getUsers();

    const newUser = {
      username: 'andcoder',
      name: 'Andres',
      lastname: 'Fontalvo',
      password: 'Contraseña'
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.errors.username.message).toContain('invalid username');
    const usersAtEnd = await getUsers();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});