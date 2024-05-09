const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json()); //using middleware

//read tours from local data in json format
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
app.post('/api/v1/tours', (request, respond) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, request.body); //create new object from request
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    () => {
      respond.status(201).json({
        status: 'successfully add new tour',
        data: {
          tours: tours,
        },
      });
    }
  );
});
const port = 3000;

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});
