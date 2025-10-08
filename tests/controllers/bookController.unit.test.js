describe('BookController (unit)', () => {
    let req, res;
    let mockBookService;
    let bookController, validateBook;
    let ExpectedErrors;

    beforeEach(() => {
        jest.resetModules();

        mockBookService = {
            listBooks: jest.fn(),
            getBook: jest.fn(),
            createBook: jest.fn(),
            updateBook: jest.fn(),
            deleteBook: jest.fn(),
        };

        // Import error helpers
        const { ExpectedErrors: ErrorHelpers } = require('../helpers/errorHelpers');
        ExpectedErrors = ErrorHelpers;

        // Mock container BEFORE requiring controller
        jest.doMock('../../src/services/container', () => ({
            bookService: mockBookService,
        }));

        // Mock validation util
        const validateBookMock = jest.fn();
        jest.doMock('../../src/utils/validation', () => ({
            validateBook: validateBookMock,
        }));

        // Now require SUT (after mocks are ready)
        // eslint-disable-next-line global-require
        bookController = require('../../src/controllers/bookController');
        // eslint-disable-next-line global-require
        validateBook = require('../../src/utils/validation').validateBook;

        req = { params: {}, body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        };

    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Create Book', () => {
        it('createBook -> 201 on valid payload', async () => {
            validateBook.mockReturnValue({ isValid: true, errors: [] });
            const created = { id: 'abc', title: 'New', author: 'A', publishedDate: '2022-01-01T00:00:00.000Z', genre: 'History' };
            mockBookService.createBook.mockResolvedValue(created);

            req.body = { title: 'New', author: 'A', publishedDate: '2022-01-01T00:00:00.000Z', genre: 'History' };

            await bookController.createBook(req, res);

            expect(validateBook).toHaveBeenCalledWith(req.body);
            expect(mockBookService.createBook).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(created);
        });

        it('createBook -> 400 when validation fails (missing title)', async () => {
            validateBook.mockReturnValue({
                isValid: false,
                errors: ['Title is required and must be a non-empty string'],
            });
            req.body = { author: 'A', publishedDate: '2022-01-01T00:00:00.000Z', genre: 'History' };

            await bookController.createBook(req, res);

            expect(validateBook).toHaveBeenCalledWith(req.body);
            expect(mockBookService.createBook).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(ExpectedErrors.validationFailed(['Title is required and must be a non-empty string']));
        });

        it('createBook -> 500 when service throws', async () => {
            validateBook.mockReturnValue({ isValid: true, errors: [] });
            mockBookService.createBook.mockRejectedValue(new Error('DB down'));
            req.body = { title: 'T', author: 'A', publishedDate: '2022-01-01T00:00:00.000Z', genre: 'Fiction' };

            await bookController.createBook(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(ExpectedErrors.internalError(['DB down']));
        });

    });

    describe('getAllBooks', () => {
        it('getAllBooks -> 200 returns array', async () => {
            mockBookService.listBooks.mockResolvedValue([{ id: '1' }]);

            await bookController.getAllBooks(req, res);

            expect(mockBookService.listBooks).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([{ id: '1' }]);
        });
    });

    describe('getBookById', () => {
        it('getBookById -> 404 when not found', async () => {
            mockBookService.getBook.mockResolvedValue(null);
            req.params.id = 'missing';

            await bookController.getBookById(req, res);

            expect(mockBookService.getBook).toHaveBeenCalledWith('missing');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(ExpectedErrors.bookNotFound('missing'));
        });
    });

});