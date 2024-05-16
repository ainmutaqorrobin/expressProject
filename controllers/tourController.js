const fs = require('fs');

//read tours from local data in json format
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.validateID = (request, respond, next, value) => {
  console.log(`Tour id is: ${value}`);
  const tour = tours.find((el) => el.id === +request.params.id);
  if (!tour) {
    return respond
      .status(404)
      .json({ status: 'Failed', message: 'Failed to search the tour' });
  }
  next();
};

//method for get all tours
exports.getAllTours = (request, respond) => {
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
exports.getSingleTour = (request, respond) => {
  const tour = tours.find((el) => el.id === +request.params.id);
  respond.status(200).json({ status: 'Success', data: { tours: tour } });
};

//method for create new tour
exports.createTour = (request, respond) => {
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
exports.updateTour = (request, respond) => {
  const tour = tours.find((el) => el.id === +request.params.id);
  respond.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
};

//method for delete tour
exports.deleteTour = (request, respond) => {
  respond.status(204).json({
    status: 'Success',
    data: null,
  });
};
