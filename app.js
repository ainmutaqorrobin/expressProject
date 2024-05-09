const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json()); //using middleware

//read tours from local data in json format
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//get all tours endpoint
app.get('/api/v1/tours', (request, respond) => {
  respond.status(200).json({
    status: 'Success',
    result: tours.length,
    data: {
      tours: tours,
    },
  });
});

//get single tour endpoint
app.get('/api/v1/tours/:id', (request, respond) => {
  const tour = tours.find((el) => el.id === +request.params.id);
  if (!tour) {
    return respond.status(404).json({
      status: 'Failed',
      message: 'Id does not exist in tour',
    });
  }
  respond.status(200).json({
    status: 'Success',
    data: {
      tour: tour,
    },
  });
});

//add new tour endpoint
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

//update tour endpoint
app.patch('/api/v1/tours/:id', (request, respond) => {
  console.log(`triggered`);
  const tour = tours.find((el) => el.id === +request.params.id);
  if (!tour) {
    return respond.status(404).json({
      status: 'Failed',
      message: 'Could not find and update the tour',
    });
  }
  respond.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});
const port = 3000;

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});
