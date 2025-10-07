const express = require('express');
const bookModel = require('./models/bookModel');
const bookRoutes = require('./routes/bookRoutes');

const app = express();

// the port the server will listen on, defaulting to 3000 if not specified in environment variables
const PORT = process.env.PORT || 3000;

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


// start the server and listen for requests on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
