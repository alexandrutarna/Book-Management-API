class BookModel {
    constructor() {
        // in-memory storage for books
        this.books = new Map();
    }

    // get all books
    getAll() {
        return Array.from(this.books.values());
    }

    // get a book by its id
    getById(id) {
        return this.books.get(id);
    }

    // add a new book
    create(bookData) {
        // todo: replace with uuid
        const id = Date.now().toString(); // simple unique id based on timestamp for now
        const newBook = { id, ...bookData };
        this.books.set(id, newBook);
        return newBook;
    }

    // update an existing book
    update(id, bookData) {
        if (!this.books.has(id)) {
            return null;
        }
        const updatedBook = { id, ...bookData };
        this.books.set(id, updatedBook);
        return updatedBook;
    }

    // delete a book by its id
    delete(id) {
        return this.books.delete(id);
    }
}

// export a singleton instance of the BookModel
module.exports = new BookModel();