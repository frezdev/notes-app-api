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