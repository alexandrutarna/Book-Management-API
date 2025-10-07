import ApiError from '../errors/model.js';
import { validateBook } from '../utils/validation.js';
export default class BookController {

    constructor(service) {
        this.service = service;

        // Bind methods to the instance to ensure correct 'this' context
        this.getAllBooks = this.getAllBooks.bind(this);
        this.getBookById = this.getBookById.bind(this);
        this.createBook = this.createBook.bind(this);
        this.updateBook = this.updateBook.bind(this);
        this.deleteBook = this.deleteBook.bind(this);
    }

    getAllBooks(req, res) {
        try {
            const books = this.service.getAll();
            res.status(200).json(books);
        } catch (error) {
            res.status(500).json(new ApiError(500, 'Internal Server Error', [error.message]).toJSON());
        }
    }

    getBookById(req, res) {
        try {
            const { id } = req.params;
            const book = this.service.getById(id);

            if (!book) {
                return res.status(404).json(new ApiError(404, 'Book not found').toJSON());
            }

            res.status(200).json(book);
        } catch (error) {
            res.status(500).json(new ApiError(500, 'Internal Server Error', [error.message]).toJSON());
        }
    }

    createBook(req, res) {
        try {
            const bookData = req.body;

            // validate
            const validation = validateBook(bookData);
            if (!validation.isValid) {
                return res.status(400).json(new ApiError(400, 'Validation Failed', validation.errors).toJSON());
            }

            const newBook = this.service.create(bookData);
            res.status(201).json(newBook);
        } catch (error) {
            res.status(500).json(new ApiError(500, 'Internal Server Error', [error.message]).toJSON());
        }
    }

    updateBook(req, res) {
        try {
            const { id } = req.params;
            const bookData = req.body;

            // validate payload
            const validation = validateBook(bookData);
            if (!validation.isValid) {
                return res.status(400).json(new ApiError(400, 'Validation Failed', validation.errors).toJSON());
            }

            const updatedBook = this.service.update(id, bookData);
            if (!updatedBook) {
                return res.status(404).json(new ApiError(404, 'Book not found').toJSON());
            }

            res.status(200).json(updatedBook);
        } catch (error) {
            res.status(500).json(new ApiError(500, 'Internal Server Error', [error.message]).toJSON());
        }
    }

    deleteBook(req, res) {
        try {
            const { id } = req.params;
            const deleted = this.service.delete(id);

            if (!deleted) {
                return res.status(404).json(new ApiError(404, 'Book not found').toJSON());
            }

            res.status(204).send();
        }
        catch (error) {
            res.status(500).json(new ApiError(500, 'Internal Server Error', [error.message]).toJSON());
        }
    }
}
