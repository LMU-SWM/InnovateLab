const express = require('express');
const eventRoutes = require('./routes/eventRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const roomRoutes = require('./routes/roomRoutes');

const { MongoClient } = require('mongodb');


const app = express();

app.use(express.json());

const connectionString = 'mongodb+srv://lmuswm:trialpassword123@i-prototypecluster.wqxzkwq.mongodb.net/?retryWrites=true&w=majority';
MongoClient.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    const db = client.db('Innovate');
    console.log('Connected to MongoDB Atlas');

    // Pass the database connection to the controllers or services if needed
    const eventController = require('./controllers/eventController')(db);
    const calendarController = require('./controllers/calendarController')(db);
    const roomController = require('./controllers/roomController')(db);

    // Register the event and calendar routes
    app.use('/events', eventRoutes(eventController));
    app.use('/calendars', calendarRoutes(calendarController));
    app.use('/rooms', roomRoutes(roomController));

    // Start the server
    app.listen(3000, () => {
      console.log('Server started on port 3000');
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });
