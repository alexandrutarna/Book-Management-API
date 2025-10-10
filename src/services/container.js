const fs = require('fs');
const path = require('path');

const InMemoryBookRepository = require('../repositories/bookRepository.memory');

const BookService = require('./bookService');

const seedPath = path.join(__dirname, '..', 'models', 'samples.json');
const seed = fs.existsSync(seedPath)
    ? JSON.parse(fs.readFileSync(seedPath, 'utf8'))
    : [];

const repo = new InMemoryBookRepository(seed);
const bookService = new BookService(repo);

module.exports = { bookService, repo }; // export repo too for tests