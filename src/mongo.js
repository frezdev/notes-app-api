const { connect } = require('mongoose');
const {MONGO_URI, MONGO_URI_TEST, NODE_ENV} = require('../utils/config.js');

const connectionString = NODE_ENV === 'test'
  ? MONGO_URI_TEST
  : MONGO_URI;

const mongoDbConnect = async () => {
  console.log(connectionString);
  const resp = await connect(connectionString, { useNewUrlParser: true });
  try {
    console.log(`MongoDB Connected: ${resp.connection.host}`);
  } catch (error) {
    console.error(error);
  }
};

module.exports = mongoDbConnect;

// Note.find({}).then(result => {
//   console.log(result);
//   connection.close();
// });

// const note = new Note({
//   title: 'Este es un nuevo titulo',
//   body: 'Este es el cuerpo de la nota',
//   date: new Date().toUTCString()
// });

// note.save()
//   .then(result => {
//     console.log(result);
//     connection.close();
//   })
//   .catch(err => console.error('ERROR', err));