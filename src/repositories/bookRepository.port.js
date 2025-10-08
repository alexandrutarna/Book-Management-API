module.exports = class BookRepositoryPort {
    async list() { throw new Error('not implemented'); }
    async getById(_id) { throw new Error('not implemented'); }
    async create(_bookObj) { throw new Error('not implemented'); }
    async update(_id, _partial) { throw new Error('not implemented'); }
    async remove(_id) { throw new Error('not implemented'); }
};