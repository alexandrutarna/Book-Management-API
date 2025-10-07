import { randomUUID } from 'crypto';

// just a data class
export class Book {
    constructor(id, title, author, publishedDate, genre) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.publishedDate = publishedDate;
        this.genre = genre;
    }
}

export class Service {
    constructor() {
        // in-memory storage for books
        this.books = new Map();
        this.initializeSampleData();
    }

    // Initialize with some sample data
    initializeSampleData() {
        const sampleBooks = [
            {
                id: randomUUID(),
                title: 'Hommo Deus',
                author: 'Yuval Noah Harari',
                publishedDate: '2015-10-15T00:00:00.000Z',
                genre: 'Non-Fiction'
            },
            {
                id: randomUUID(),
                title: 'Animal Farm',
                author: 'George Orwell',
                publishedDate: '1945-08-17T00:00:00.000Z',
                genre: 'Political Satire'
            },
            {
                id: randomUUID(),
                title: 'Rich Dad Poor Dad',
                author: 'Robert Kiyosaki',
                publishedDate: '1997-04-01T00:00:00.000Z',
                genre: 'Personal Finance'
            },
            {
                id: randomUUID(),
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

    getAll() {
        return Array.from(this.books.values());
    }

    getById(id) {
        return this.books.get(id);
    }
    create(bookData) {
        // todo: take into account the case with number
        const id = randomUUID();
        const newBook = new Book(id, bookData.title, bookData.author, bookData.publishedDate, bookData.genre);
        this.books.set(id, newBook);
        return newBook;
    }

    update(id, bookData) {
        if (!this.books.has(id)) {
            return null;
        }
        const updatedBook = new Book(id, bookData.title, bookData.author, bookData.publishedDate, bookData.genre);
        this.books.set(id, updatedBook);
        return updatedBook;
    }
    delete(id) {
        return this.books.delete(id);
    }
}