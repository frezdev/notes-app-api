const { connect } = require('mongoose');
const config = require('../config');


(async () => {
  const resp = await connect(config.MONGO_URI, { useNewUrlParser: true });
  try {
    console.log(`MongoDB Connected: ${resp.connection.host}`);
  } catch (error) {
    console.error(error);
  }
})();

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