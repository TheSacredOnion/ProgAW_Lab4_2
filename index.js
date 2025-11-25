'use strict';

const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors');

app.use(cors());

const jokes = JSON.parse(fs.readFileSync('./jokes.json', 'utf8'));
const categories = Object.keys(jokes);

app.get('/jokebook/joke/:category', (req, res) => {
  const category = req.params.category;

  if (!jokes[category]) {
    return res.status(404).json({ error: 'No jokes for category: ' + category });
  }

  const list = jokes[category];
  const randomJoke = list[Math.floor(Math.random() * list.length)];
  res.json(randomJoke);
});

app.get('/jokebook/categories', (req, res) => {
  res.json({ categories });
});

app.post('/jokebook/joke/:category', express.json(), (req, res) => {
  const category = req.params.category;
  const newJoke = req.body;

  if (!jokes[category]) {
    return res.status(404).json({ error: 'No jokes for category: ' + category });
  }

  jokes[category].push(newJoke);
  fs.writeFileSync('./jokes.json', JSON.stringify(jokes, null, 2));
  res.status(201).json(newJoke);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
