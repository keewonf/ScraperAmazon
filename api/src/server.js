/**
 * Custom error class for application-specific errors
 */
const AppError = require('./utils/AppError');

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3333
const routes = require('./routes');

// Allows Express to understand requests with JSON in the body
app.use(cors());
app.use(express.json());

/**
 * Register API routes
 */
app.use(routes);

/**
 * Global error handler middleware
 * Handles both custom AppErrors and unexpected errors
 */
app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message });
  }

  // If the error is not an AppError type, send a generic error response
  response.status(500).json({ error: 'Internal Server Error' });
});

/**
 * Start the server on the specified port
 */
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));