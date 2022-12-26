const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');


const userSchema = new Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  notes: [{
    type: Schema.Types.ObjectId,
    ref: 'Note'
  }]
});


userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  }
});

userSchema.pre('save', async function(next) {
  const user = this;
  if (!user.isModified('passwordHash')) return next();

  try {
    const saltRounds = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.passwordHash, saltRounds);

    user.passwordHash = hash;
  } catch (error) {
    console.error(error);
    next();
  }
});

userSchema.plugin(uniqueValidator, { message: 'invalid {PATH}' });
const User = model('User', userSchema);

module.exports = User;