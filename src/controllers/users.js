const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User.js');

usersRouter.post('/', async (request, response) => {
  try {
    const { body } = request;
    const { username, name, lastname, password } = body;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = new User({
      name,
      lastname,
      username,
      passwordHash
    });
    const savedUser = await user.save(console.error);
    response.status(201).json(savedUser);
  } catch (error) {
    response.status(400).json({error});
  }
});

module.exports = usersRouter;