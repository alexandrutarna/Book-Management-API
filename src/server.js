// const express = require('express');
// const bookModel = require('./models/bookModel.js');
// const bookRoutes = require('./routes/bookRoutes');
import express from 'express';
import { Service } from './models/bookModel.js';
import BookController from './controllers/bookController.js';
import makeBookRoutes from './routes/bookRoutes.js';
// import bookRoutes from './routes/bookRoutes.js';

const app = express();

// the port the server will listen on, defaulting to 3000 if not specified in environment variables
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// use cors middleware to allow cross-origin requests (for development purposes)
// otherwise the TRY IT OUT feature in Swagger UI won't work
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Initialize service and controller
const bookService = new Service();
const bookController = new BookController(bookService);

// Create routes with the controller
const bookRoutes = makeBookRoutes(bookController);

// Mount book routes
app.use('/', bookRoutes);


// start the server and listen for requests on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
