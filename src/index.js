const express = require('express');
const cors = require('cors');
const logger = require('../utils/loggerMiddelware.js');
const unknown = require('../utils/unknownMiddelware.js');
const app = express();

app.use(cors());
app.use(express.json());

app.use(logger);

let notes = [
  {
    id: 1,
    title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
    body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
    date: '2022-12-01T15:06:50.220Z'
  },
  {
    id: 2,
    title: 'qui est esse',
    body: 'est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla',
    date: '2022-12-01T16:06:50.220Z'
  },
  {
    id: 3,
    title: 'ea molestias quasi exercitationem repellat qui ipsa sit aut',
    body: 'et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut',
    date: '2022-12-01T18:08:50.220Z'
  }
];

app.get('/', (request, response) => {
  response.send('<h1>NotesApp API</h1>');
});

app.get('/api/notes', (request, response) => {
  response.json(notes);
});

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find(note => note.id === id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter(note => note.id !== id);
  response.json(notes);
  response.status(204).end();
});

app.post('/api/notes', (request, response) => {
  const note = request.body;

  if (!note || !note.body) {
    return response.status(400).json({
      error: 'note.content is missing'
    });
  }

  const ids = notes.map(note => note.id);
  const maxId = Math.max(...ids);

  const newNote = {
    id: maxId + 1,
    title: note.title,
    body: note.body,
    date: new Date().toISOString()
  };
  notes = [...notes, newNote];
  response.status(201).json(newNote);
});

app.use(unknown);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
