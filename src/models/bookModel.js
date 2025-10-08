class Book {
    constructor({ id, title, author, publishedDate, genre }) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.publishedDate = publishedDate;
        this.genre = genre;
    }
}

module.exports = Book;