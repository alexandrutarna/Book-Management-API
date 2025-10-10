const express = require('express');

const bookController = require('../controllers/bookController')

const router = express.Router();

router.get('/books/', (req, res) => { bookController.getAllBooks(req, res); });

router.get('/books/:id', (req, res) => { bookController.getBookById(req, res); });

router.post('/books/', (req, res) => { bookController.createBook(req, res); });

router.put('/books/:id', (req, res) => { bookController.updateBook(req, res); });

router.delete('/books/:id', (req, res) => { bookController.deleteBook(req, res); });

module.exports = router;