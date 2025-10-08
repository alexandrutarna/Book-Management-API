const e = require('express');

describe('BookController (unit)', () => {
    let req, res;
    let mockBookService;
    let bookController, validateBook;
    let expectedError;

    beforeEach(() => {
        jest.resetModules();

        mockBookService = {
            listBooks: jest.fn(),
            getBook: jest.fn(),
            createBook: jest.fn(),
            updateBook: jest.fn(),
            deleteBook: jest.fn(),
        };
        // const { ExpectedErrors } = require('../helpers/errorHelpers');
        expectedError = require('../helpers/errorHelpers').ExpectedErrors;

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

    it('getBookById → 404 when not found', async () => {
        mockBookService.getBook.mockResolvedValue(null);
        req.params.id = 'missing';
        await bookController.getBookById(req, res);
        expect(mockBookService.getBook).toHaveBeenCalledWith('missing');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(expectedError.bookNotFound('missing'));
    });

    it('createBook → 201 on valid payload', async () => {
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

    it('createBook → 400 when validation fails (missing title)', async () => {
        validateBook.mockReturnValue({
            isValid: false,
            errors: ['Title is required and must be a non-empty string'],
        });
        req.body = { author: 'A', publishedDate: '2022-01-01T00:00:00.000Z', genre: 'History' };

        await bookController.createBook(req, res);

        expect(validateBook).toHaveBeenCalledWith(req.body);
        expect(mockBookService.createBook).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expectedError.validationFailed(['Title is required and must be a non-empty string']));
    });

    it('getAllBooks → 200 returns array', async () => {
        mockBookService.listBooks.mockResolvedValue([{ id: '1' }]);
        await bookController.getAllBooks(req, res);
        expect(mockBookService.listBooks).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ id: '1' }]);
    });

    it('updateBook → 400 when validation fails', async () => {
        req.params.id = '1';
        req.body = { title: '' };
        validateBook.mockReturnValue({
            isValid: false,
            errors: ['Title is required and must be a non-empty string'],
        });

        await bookController.updateBook(req, res);

        expect(validateBook).toHaveBeenCalledWith(req.body);
        expect(mockBookService.updateBook).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expectedError.validationFailed(['Title is required and must be a non-empty string']));
    });

    it('deleteBook → 404 when not found', async () => {
        req.params.id = 'x';
        mockBookService.deleteBook.mockResolvedValue(false);
        await bookController.deleteBook(req, res);
        expect(mockBookService.deleteBook).toHaveBeenCalledWith('x');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(expectedError.bookNotFound('x'));
    });

    it('createBook → 500 when service throws', async () => {
        validateBook.mockReturnValue({ isValid: true, errors: [] });
        mockBookService.createBook.mockRejectedValue(new Error('DB down'));
        req.body = { title: 'T', author: 'A', publishedDate: '2022-01-01T00:00:00.000Z', genre: 'Fiction' };

        await bookController.createBook(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expectedError.internalError(['DB down']));
    });
});