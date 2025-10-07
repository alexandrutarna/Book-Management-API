// // const express = require('express');
// // const bookModel = require('../models/bookModel.js');
// // const bookController = require('../controllers/bookController')
// import { Router } from 'express';
// import bookController from '../controllers/bookController.js';

// const router = Router();

// // GET all books
// router.get('/books/', (req, res) => { bookController.getAllBooks(req, res); });

// // GET a book by ID
// router.get('/books/:id', (req, res) => { bookController.getBookById(req, res); });

// // POST (create) a new book
// router.post('/books', (req, res) => { bookController.createBook(req, res); });

// // PUT (update) an existing book by ID
// router.put('/books/:id', (req, res) => { bookController.updateBook(req, res); });

// // DELETE book
// router.delete('/books/:id', (req, res) => { bookController.deleteBook(req, res); });

// // module.exports = router;
// export default router;


import { Router } from 'express'

export default function makeBookRoutes(controller) {
    const router = Router()

    router.get('/books', controller.getAllBooks)
    router.get('/books/:id', controller.getBookById)
    router.post('/books', controller.createBook)
    router.put('/books/:id', controller.updateBook)
    router.delete('/books/:id', controller.deleteBook)

    return router
}