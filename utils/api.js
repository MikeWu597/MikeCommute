const express = require('express');
const router = express.Router();

// Sample GET route
router.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Sample GET route with ID parameter
router.get('/item/:id', (req, res) => {
  const id = req.params.id;
  res.json({ message: `Retrieved item with ID: ${id}` });
});

// Sample POST route
router.post('/item', (req, res) => {
  const data = req.body;
  res.status(201).json({ message: 'Item created', data: data });
});

module.exports = router;