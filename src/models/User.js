const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
  name: String,
  lastname: String,
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
userSchema.plugin(uniqueValidator);

const User = model('User', userSchema);

module.exports = User;