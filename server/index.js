const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

MONGODB_URI = "mongodb+srv://lmuswm:aqoqHMp64BZGOS2w@i-prototypecluster.wqxzkwq.mongodb.net/"

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true, // added option
  // useFindAndModify: false // added option
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('Error connecting to MongoDB', err));

// Middleware for parsing JSON
app.use(express.json());

// API routes
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal server error');
});

// Start server
app.listen(port, () => console.log(`Server listening on port ${port}`));
