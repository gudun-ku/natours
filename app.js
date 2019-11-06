const fs = require('fs');
const express = require('express');

const app = express();

//asking for using middleware
app.use(express.json());

/*
app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello from the server side!', app: 'Natours' });
});

app.post('/', (req, res) => {
  res.send('You can post to this endpoint...');
});
*/

// read the data file outside of the event loop

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}\\dev-data\\data\\tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
});

//get only one tour
app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params);

  // small nice trick
  const id = req.params.id * 1;

  // if (id > tours.length) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID'
  //   });
  // }

  const tour = tours.find(el => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

//post a tour
app.post('/api/v1/tours', (req, res) => {
  //use middleware to put body in express request
  //console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}\\dev-data\\data\\tours-simple.json`,
    JSON.stringify(tours),
    err => {
      if (err) res.status(500).send('Error saving tour!');

      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
});

app.patch('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>'
    }
  });
});

app.delete('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
