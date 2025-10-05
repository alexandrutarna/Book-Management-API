const { v4: uuidv4 } = require('uuid');
class BookModel {
    constructor() {
        // in-memory storage for books
        this.books = new Map();
        this.initializeSampleData();
    }

    // Initialize with some sample data
    initializeSampleData() {
        const sampleBooks = [
            {
                id: uuidv4(),
                title: 'Hommo Deus',
                author: 'Yuval Noah Harari',
                publishedDate: '2015-10-15T00:00:00.000Z',
                genre: 'Non-Fiction'
            },
            {
                id: uuidv4(),
                title: 'Animal Farm',
                author: 'George Orwell',
                publishedDate: '1945-08-17T00:00:00.000Z',
                genre: 'Political Satire'
            },
            {
                id: uuidv4(),
                title: 'Rich Dad Poor Dad',
                author: 'Robert Kiyosaki',
                publishedDate: '1997-04-01T00:00:00.000Z',
                genre: 'Personal Finance'
            },
            {
                id: uuidv4(),
                title: 'You dont know JS',
                author: 'Kyle Simpson',
                publishedDate: '2014-11-17T00:00:00.000Z',
                genre: 'Programming'
            }
        ];

        sampleBooks.forEach(book => {
            this.books.set(book.id, book);
        });
    }

    // get all books
    getAll() {
        return Array.from(this.books.values());
    }

    // get a book by its id
    getById(id) {
        console.log('Fetching book with ID:', id);
        // console.log('Current books in storage:', this.books);
        return this.books.get(id.toString()) || null;
    }

    // add a new book
    create(bookData) {
        // todo: take into account the case with number
        const id = uuidv4();
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