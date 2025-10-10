const { bookService } = require('../services/container');
const { validateBook } = require('../utils/validation');
const { ErrorResponses } = require('../utils/errorResponse');

class BookController {
    async getAllBooks(req, res) {
        try {
            const books = await bookService.listBooks();
            res.status(200).json(books);
        } catch (error) {
            ErrorResponses.internalError(res, 'Internal server error', [error.message]);
        }
    }

    async getBookById(req, res) {
        try {
            const { id } = req.params;
            const book = await bookService.getBook(id);
            if (!book) {return ErrorResponses.bookNotFound(res, id);}
            res.status(200).json(book);
        } catch (error) {
            ErrorResponses.internalError(res, 'Internal server error', [error.message]);
        }
    }

    async createBook(req, res) {
        try {
            const validation = validateBook(req.body);
            if (!validation.isValid) {
                return ErrorResponses.validationFailed(res, validation.errors);
            }
            const newBook = await bookService.createBook(req.body);
            res.status(201).json(newBook);
        } catch (error) {
            ErrorResponses.internalError(res, 'Internal server error', [error.message]);
        }
    }

    async updateBook(req, res) {
        try {
            const { id } = req.params;
            const validation = validateBook(req.body);
            if (!validation.isValid) {
                return ErrorResponses.validationFailed(res, validation.errors);
            }
            const updatedBook = await bookService.updateBook(id, req.body);
            if (!updatedBook) {return ErrorResponses.bookNotFound(res, id);}
            res.status(200).json(updatedBook);
        } catch (error) {
            ErrorResponses.internalError(res, 'Internal server error', [error.message]);
        }
    }

    async deleteBook(req, res) {
        try {
            const { id } = req.params;
            const deleted = await bookService.deleteBook(id);
            if (!deleted) {return ErrorResponses.bookNotFound(res, id);}
            res.status(204).send();
        } catch (error) {
            ErrorResponses.internalError(res, 'Internal server error', [error.message]);
        }
    }
}

module.exports = new BookController();
