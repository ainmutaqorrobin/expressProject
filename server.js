const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (error) => {
  console.log('UNCAUGHT EXCEPTION, Shutting down...');
  console.log(error.name, error.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((connection) => {
    console.log(`Connect successfully`);
  })
  .catch((error) => {
    console.log('Error in connecting with DB');
    server.close(() => {
      process.exit(1);
    });
  });

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});
