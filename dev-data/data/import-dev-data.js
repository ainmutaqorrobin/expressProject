const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');
dotenv.config({ path: '../../config.env' });

const DB = process.env.DATABASE;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(() => {
    console.log(`MongoDB connected successfully`);
  });

//READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);
//IMPORT tours to DB
const importTours = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully imported to DB');
  } catch (error) {
    console.log('Error in importing json data to DB');
    console.log(error);
  }
  process.exit();
};

//DELETE EXISTED COLLECTION IN DB
const deleteTour = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted');
  } catch (error) {
    console.log('Error in delete collection in DB');
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importTours();
} else if (process.argv[2] === '--delete') {
  deleteTour();
}
console.log(process.argv);
