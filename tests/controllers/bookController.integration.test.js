const InMemoryBookRepository = require('../../src/repositories/bookRepository.memory');
const BookService = require('../../src/services/bookService');
const { ExpectedErrors } = require('../helpers/errorHelpers');

describe('BookController', () => {
    let req, res, next, repo, svc, bookController;

    beforeEach(() => {
        // Create fresh, EMPTY repo every test — no seed
        repo = new InMemoryBookRepository([]);
        svc = new BookService(repo);

        // Mock the container before requiring the controller
        jest.doMock('../../src/services/container', () => ({
            bookService: svc
        }));

        // Clear the require cache and require the controller fresh each time
        delete require.cache[require.resolve('../../src/controllers/bookController')];
        bookController = require('../../src/controllers/bookController');

        req = {
            params: {},
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        };
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('getAllBooks', () => {
        it('should return all books with status 200', async () => {
            const mockBooks = [
                { id: '1', title: 'Book 1', author: 'Author 1', publishedDate: '2020-01-01T00:00:00.000Z', genre: 'Fiction' },
                { id: '2', title: 'Book 2', author: 'Author 2', publishedDate: '2021-01-01T00:00:00.000Z', genre: 'Science' },
            ];
            repo.books.set('1', mockBooks[0]);
            repo.books.set('2', mockBooks[1]);

            await bookController.getAllBooks(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockBooks);
        });

        it('should return empty array when no books exist', async () => {

            const expectedResponse = [];

            await bookController.getAllBooks(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expectedResponse);
        });

        it('should handle errors gracefully', async () => {
            jest.spyOn(svc, 'listBooks').mockRejectedValue(new Error('Database error'));
            const expectedResponse = ExpectedErrors.internalError(['Database error']);

            await bookController.getAllBooks(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expectedResponse);
        });
    });

    describe('getBookById', () => {
        it('should return a book with status 200 when book exists', async () => {
            const mockBook = { id: '1', title: 'Test Book', author: 'Test Author', publishedDate: '2020-01-01T00:00:00.000Z', genre: 'Fiction' };
            repo.books.set('1', mockBook);
            req.params.id = '1';

            await bookController.getBookById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockBook);
        });

        it('should return 404 when book does not exist', async () => {
            req.params.id = 'non-existent-id';

            await bookController.getBookById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(ExpectedErrors.bookNotFound('non-existent-id'));
        });

        it('should handle errors gracefully', async () => {
            req.params.id = '1';
            jest.spyOn(svc, 'getBook').mockRejectedValue(new Error('Database error'));

            await bookController.getBookById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(ExpectedErrors.internalError(['Database error']));
        });
    });

    describe('createBook', () => {
        it('should create a new book and return it with status 201', async () => {
            req.body = {
                title: 'New Book',
                author: 'New Author',
                publishedDate: '2022-01-01T00:00:00.000Z',
                genre: 'History'
            };

            await bookController.createBook(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                id: expect.any(String),
                title: 'New Book',
                author: 'New Author',
                publishedDate: '2022-01-01T00:00:00.000Z',
                genre: 'History'
            }));
        });

        it('should return 400 when title is missing', async () => {
            req.body = {
                author: 'New Author',
                publishedDate: '2022-01-01T00:00:00.000Z',
                genre: 'History'
            };
            const expectedError = ExpectedErrors.validationFailed(['Title is required and must be a non-empty string']);

            await bookController.createBook(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expectedError);
        });

    });
});
