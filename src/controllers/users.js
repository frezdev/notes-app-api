const usersRouter = require('express').Router();
const User = require('../models/User.js');

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('notes', {
    title: 1,
    body: 1,
    date: 1
  });
  response.json(users);
});

usersRouter.get('/:id', async (request, response, next) => {
  const { id } = request.params;

  const user = await User.findById(id).populate('notes', {
    title: 1,
    body: 1,
    date: 1
  });

  try {
    if (user) return response.status(200).json(user);
  } catch (error) {
    response.status(404).end();
    next(error);
  }
});

usersRouter.post('/', async (request, response) => {
  const { body } = request;
  const { username, name, lastname, password } = body;

  try {
    const user = new User({
      name,
      lastname,
      username,
      passwordHash: password
    });

    const savedUser = await user.save();
    response.status(201).json(savedUser);

  } catch (error) {
    return response.status(400).json(error);
  }
});

module.exports = usersRouter;