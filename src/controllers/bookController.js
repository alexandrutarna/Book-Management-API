const bookModel = require('../models/bookModel');
const { validateBook } = require('../utils/validation');

class BookController {

    /**
     * Get all books
     */
    getAllBooks(req, res) {
        try {
            const books = bookModel.getAll();
            res.status(200).json(books);
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                details: [error.message]
            });
        }
    }

    /**
     * Get a single book by ID
     */
    getBookById(req, res) {
        try {
            const { id } = req.params;
            const book = bookModel.getById(id);

            if (!book) {
                return res.status(404).json({
                    status: 404,
                    message: 'Book not found'
                });
            }

            res.status(200).json(book);
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                details: [error.message]
            });
        }
    }

    /**
     * Create a new book
     */
    createBook(req, res) {
        try {
            const bookData = req.body;

            // validate
            const validation = validateBook(bookData);
            if (!validation.isValid) {
                return res.status(400).json({
                    status: 400,
                    message: 'Validation Failed',
                    details: validation.errors
                });
            }

            const newBook = bookModel.create(bookData);
            res.status(201).json(newBook);
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                details: [error.message]
            });
        }
    }

    /**
     * Update a book
     */
    updateBook(req, res) {
        try {
            const { id } = req.params;
            const bookData = req.body;

            // validate payload
            const validation = validateBook(bookData);
            if (!validation.isValid) {
                return res.status(400).json({
                    status: 400,
                    message: 'Validation failed',
                    details: validation.errors
                });
            }

            const updatedBook = bookModel.update(id, bookData);
            if (!updatedBook) {
                return res.status(404).json({
                    status: 404,
                    message: 'Book not found'
                });
            }

            res.status(200).json(updatedBook);
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                details: [error.message]
            });
        }
    }

    /**
     * Delete a book by it's ID
     */
    deleteBook(req, res) {
        try {
            const { id } = req.params;
            const deleted = bookModel.delete(id);

            if (!deleted) {
                return res.status(404).json({
                    status: 404,
                    message: 'Book not found'
                });
            }

            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                details: [error.message]
            });
        }
    }
}

// export a singleton instance of the BookController
module.exports = new BookController();