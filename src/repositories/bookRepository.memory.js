const { randomUUID } = require('crypto');
const Port = require('./bookRepository.port');

class InMemoryBookRepository extends Port {
    constructor(seed = []) {
        super();
        this.books = new Map();
        seed.forEach(b => {
            const id = b.id ?? randomUUID();
            this.books.set(id, { ...b, id });
        });
    }

    async list() { return [...this.books.values()]; }
    async getById(id) { return this.books.get(id) ?? null; }
    async create(bookObj) {
        const id = randomUUID();
        const saved = { ...bookObj, id };
        this.books.set(id, saved);
        console.log(saved);
        return saved;
    }
    async update(id, partial) {
        const ex = this.books.get(id);
        if (!ex) return null;
        const updated = { ...ex, ...partial, id };
        this.books.set(id, updated);
        return updated;
    }
    async remove(id) { return this.books.delete(id); }
}

module.exports = InMemoryBookRepository;
