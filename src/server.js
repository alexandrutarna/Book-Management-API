const express = require('express');
const bookModel = require('./models/bookModel');

const app = express();

// the port the server will listen on, defaulting to 3000 if not specified in environment variables
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Book Management API' });
});

app.get('/books', (req, res) => {
    const books = bookModel.getAll();
    res.status(200).json(books);
});

app.get('/books/:id', (req, res) => {
    const { id } = req.params;
    const book = bookModel.getById(id);

    if (!book) {
        return res.status(404).json({
            status: 404,
            message: 'Book not found'
        });
    }

    res.status(200).json(book);
});

app.post('/books', (req, res) => {
    const bookData = req.body;
    const newBook = bookModel.create(bookData);
    res.status(201).json(newBook);
});

app.put('/books/:id', (req, res) => {
    const { id } = req.params;
    const bookData = req.body;
    const updatedBook = bookModel.update(id, bookData);

    if (!updatedBook) {
        return res.status(404).json({
            status: 404,
            message: 'Book not found'
        });
    }

    res.status(200).json(updatedBook);
});


app.delete('/books/:id', (req, res) => {
    const { id } = req.params;
    const deletedBook = bookModel.delete(id);

    if (!deletedBook) {
        return res.status(404).json({
            status: 404,
            message: 'Book not found'
        });
    }

    res.status(204).send();
});

// start the server and listen for requests on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
