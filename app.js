const express = require('express');
const path = require('path');
const apiRoutes = require('./utils/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api', apiRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Hello World! Express application is running.');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});