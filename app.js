const express = require('express');
const fs = require('fs');

const app = express();

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
app.get('/api/v1/tours', (request, respond) => {
  respond.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours: tours,
    },
  });
});
const port = 3000;

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});
