const Book = require('../models/bookModel');
const { randomUUID } = require('crypto');

class BookService {
    constructor(bookRepo) {
        this.repo = bookRepo;
    }

    async listBooks() {
        return this.repo.list();
    }

    async getBook(id) { return this.repo.getById(id); }

    async createBook(bookData) {
        const newBook = new Book({ id: randomUUID(), ...bookData });
        return this.repo.create(newBook);
    }

    async updateBook(id, bookData) {
        return this.repo.update(id, bookData);
    }

    async deleteBook(id) {
        return this.repo.remove(id);
    }
}

module.exports = BookService;
