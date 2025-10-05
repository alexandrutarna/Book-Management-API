const express = require('express');
const bookModel = require('../models/bookModel');
const { validateBook } = require('../utils/validation');

const router = express.Router();

// GET all books
router.get('/books/', (req, res) => {
    {
        const books = bookModel.getAll();
        res.status(200).json(books);
    }
})

// GET a book by ID
router.get('/books/:id', (req, res) => {
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

// POST (create) a new book
router.post('/books', (req, res) => {
    const bookData = req.body;

    // Validate book data before creating
    const validation = validateBook(bookData);
    if (!validation.isValid) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid book data',
            errors: validation.errors
        });
    }

    const newBook = bookModel.create(bookData);
    res.status(201).json(newBook);
});

// PUT (update) an existing book by ID
router.put('/books/:id', (req, res) => {
    const { id } = req.params;
    const bookData = req.body;

    // Validate book data before updating
    const validation = validateBook(bookData);
    if (!validation.isValid) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid book data',
            errors: validation.errors
        });
    }

    const updateBook = bookModel.update(id, bookData);

    if (!updateBook) {
        return res.status(404).json({
            status: 404,
            message: 'Book not fount'
        });
    }

    res.status(200).json(updateBook);
});

// DELETE book
router.delete('/books/:id', (req, res) => {
    const { id } = req.params;
    const deleted = bookModel.delete(id);

    if (!deleted) {
        return res.status(404).json({
            status: 404,
            message: 'Book not found'
        });
    }

    res.status(204).send();
});

module.exports = router;