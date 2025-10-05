const express = require('express');
const bookModel = require('../models/bookModel');
const bookController = require('../controllers/bookController')

const router = express.Router();

// GET all books
router.get('/books/', (req, res) => { bookController.getAllBooks(req, res); });

// GET a book by ID
router.get('/books/:id', (req, res) => { bookController.getBookById(req, res); });

// POST (create) a new book
router.post('/books', (req, res) => { bookController.createBook(req, res); });

// PUT (update) an existing book by ID
router.put('/books/:id', (req, res) => { bookController.updateBook(req, res); });

// DELETE book
router.delete('/books/:id', (req, res) => { bookController.deleteBook(req, res); });

module.exports = router;