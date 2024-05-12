const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json()); //using middleware
app.use((request, respond, next) => {
  console.log(`wassap geng its robin`);
  next();
});

app.use((request, respond, next) => {
  request.requestTime = new Date().toISOString();
  next();
});
//read tours from local data in json format
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//method for get all tours
const getAllTours = (request, respond) => {
  console.log(request.requestTime);
  respond.status(200).json({
    status: 'success',
    requestTime: request.requestTime,
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

//method for get single tour
const getSingleTour = (request, respond) => {
  const tour = tours.find((el) => el.id === +request.params.id);
  if (!tour) {
    return respond
      .status(404)
      .json({ status: 'Failed', message: 'Failed to search the tour' });
  }
  respond.status(200).json({ status: 'Success', data: { tours: tour } });
};

//method for create new tour
const createTour = (request, respond) => {
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
};

//method for update tour
const updateTour = (request, respond) => {
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
};

//method for delete tour
const deleteTour = (request, respond) => {
  const tour = tours.find((el) => el.id === +request.params.id);
  if (!tour) {
    return respond.status(404).json({
      status: 'Failed',
      message: 'Failed to delete the selected tour',
    });
  }
  respond.status(204).json({
    status: 'Success',
    data: null,
  });
};

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getSingleTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getSingleTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});
