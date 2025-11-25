'use strict';

const express = require('express');
const app = express();

// define endpoint for exercise 1 here
app.get('/math/circle/:r', (req, res) => {
//TODO1  
  const r = parseFloat(req.params.r);
  const area = Math.PI * r * r;
  const circumference = 2 * Math.PI * r;
  res.json({ area, circumference });
});

//TODO2
app.get('/math/rectangle/:a/:b', (req, res) => {
  const a = parseFloat(req.params.a);
  const b = parseFloat(req.params.b);
  const area = a * b;
  const perimeter = 2 * (a + b);
  res.json({ area, perimeter });
});

//TODO3


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});