const express = require('express');
const bookModel = require('./models/bookModel');
const bookRoutes = require('./routes/bookRoutes');

const app = express();

// the port the server will listen on, defaulting to 3000 if not specified in environment variables
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Book Management API',
        version: '1.0.0',
        endpoints: {
            'GET /books': 'Retrieve all books',
            'GET /books/:id': 'Retrieve a book by ID',
            'POST /books': 'Create a new book',
            'PUT /books/:id': 'Update an existing book by ID',
            'DELETE /books/:id': 'Delete a book by ID'
        }
    });
});

// Mount book routes
app.use('/', bookRoutes);


// start the server and listen for requests on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
