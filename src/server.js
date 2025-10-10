const express = require('express');
const morgan = require('morgan');

const bookRoutes = require('./routes/bookRoutes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();

// the port the server will listen on, defaulting to 3000 if not specified in environment variables
const PORT = process.env.PORT || 3000;

// Logging middleware - Morgan
// Use different formats based on environment
const logFormat = process.env.NODE_ENV === 'production'
    ? 'combined'  // Standard Apache combined log format
    : 'dev';      // Colored output for development

app.use(morgan(logFormat));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// enable CORS for all routes and origins
// just for demo purpose, to make openapi spec working with tryout feature
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Mount book routes
app.use('/', bookRoutes);

// 404 handler for unmatched routes
app.use(notFoundHandler);

// Global error handling middleware (must be last)
app.use(errorHandler);

// start the server and listen for requests on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
