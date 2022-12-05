const { connect } = require('mongoose');
const config = require('../config');


connect(config.MONGO_URI, {useNewUrlParser: true})
  .then(() => console.log('connected'))
  .catch(err => console.error(err));


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