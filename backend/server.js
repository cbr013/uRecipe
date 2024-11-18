const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(bodyParser.json()); // Additional body parsing middleware
app.use(cors()); // Enable CORS for all requests

// Import routes
const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
