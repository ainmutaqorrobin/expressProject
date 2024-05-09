const express = require('express');

const app = express();

app.get('/', (request, respond) => {
  respond
    .status(200)
    .json({
      message: 'Robin seorang yang kacak sekali.',
      reminder: 'sila hati hati dengan dia',
    });
  console.log(`user send request`);
});
const port = 3000;

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});
