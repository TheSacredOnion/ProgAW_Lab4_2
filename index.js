'use strict';

const express = require('express');
const app = express();

let categories = ['funnyJoke', 'lameJoke'];

let funnyJoke = [

  {

    'joke': 'Dlaczego komputer poszedł do lekarza?',

    'response': 'Bo złapał wirusa!'

  },

  {

    'joke': 'Dlaczego komputer nie może być głodny?',

    'response': 'Bo ma pełen dysk!'

  },

  {

    'joke': 'Co mówi jeden bit do drugiego?',

    'response': '„Trzymaj się, zaraz się przestawiamy!”'

  }

];

let lameJoke = [

  {

    'joke': 'Dlaczego programiści preferują noc?',

    'response': 'Bo w nocy jest mniej bugów do łapania!'

  },

  {

    'joke': 'Jak nazywa się bardzo szybki programista?',

    'response': 'Błyskawiczny kompilator!'

  }

];

app.get('/jokebook/joke/:category', (req, res) => {
  const category = req.params.category;
  let jokes;

  if (category === 'funnyJoke') {
    jokes = funnyJoke;
  } else if (category === 'lameJoke') {
    jokes = lameJoke;
  } else {
    return res.status(404).json({ error: 'No jokes for category: ' + category });
  }

  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
  res.json(randomJoke);
});

app.get('/jokebook/categories', (req, res) => {
  res.json({ 'categories': categories });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});