// tests/controllers/bookController.test.js
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
        next = jest.fn();
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('getAllBooks', () => {
        it('should return all books with status 200', async () => {
            // Arrange: seed the in-memory map
            const mockBooks = [
                { id: '1', title: 'Book 1', author: 'Author 1', publishedDate: '2020-01-01T00:00:00.000Z', genre: 'Fiction' },
                { id: '2', title: 'Book 2', author: 'Author 2', publishedDate: '2021-01-01T00:00:00.000Z', genre: 'Science' },
            ];
            repo.books.set('1', mockBooks[0]);
            repo.books.set('2', mockBooks[1]);

            // Act
            await bookController.getAllBooks(req, res, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockBooks);
        });

        it('should return empty array when no books exist', async () => {
            // Act
            await bookController.getAllBooks(req, res, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([]);
        });

        it('should handle errors gracefully', async () => {
            // Arrange: mock the service to throw an error
            jest.spyOn(svc, 'listBooks').mockRejectedValue(new Error('Database error'));

            // Act
            await bookController.getAllBooks(req, res, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(ExpectedErrors.internalError(['Database error']));
        });
    });

    describe('getBookById', () => {
        it('should return a book with status 200 when book exists', async () => {
            // Arrange
            const mockBook = { id: '1', title: 'Test Book', author: 'Test Author', publishedDate: '2020-01-01T00:00:00.000Z', genre: 'Fiction' };
            repo.books.set('1', mockBook);
            req.params.id = '1';

            // Act
            await bookController.getBookById(req, res, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockBook);
        });

        it('should return 404 when book does not exist', async () => {
            // Arrange
            req.params.id = 'non-existent-id';

            // Act
            await bookController.getBookById(req, res, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(ExpectedErrors.bookNotFound('non-existent-id'));
        });

        it('should handle errors gracefully', async () => {
            // Arrange
            req.params.id = '1';
            jest.spyOn(svc, 'getBook').mockRejectedValue(new Error('Database error'));

            // Act
            await bookController.getBookById(req, res, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(ExpectedErrors.internalError(['Database error']));
        });
    });

    describe('createBook', () => {
        it('should create a new book and return it with status 201', async () => {
            // Arrange
            req.body = {
                title: 'New Book',
                author: 'New Author',
                publishedDate: '2022-01-01T00:00:00.000Z',
                genre: 'History'
            };

            // Act
            await bookController.createBook(req, res, next);

            // Assert
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
            // Arrange
            req.body = {
                author: 'New Author',
                publishedDate: '2022-01-01T00:00:00.000Z',
                genre: 'History'
            };

            // Act
            await bookController.createBook(req, res, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 400,
                message: 'Validation Failed',
                details: ['Title is required and must be a non-empty string']
            });
        });

        it('should return 400 when title is empty string', async () => {
            // Arrange
            req.body = {
                title: '   ',
                author: 'New Author',
                publishedDate: '2022-01-01T00:00:00.000Z',
                genre: 'History'
            };

            // Act
            await bookController.createBook(req, res, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 400,
                message: 'Validation Failed',
                details: ['Title is required and must be a non-empty string']
            });
        });

        it('should return 400 when author is missing', async () => {
            // Arrange
            req.body = {
                title: 'New Book',
                publishedDate: '2022-01-01T00:00:00.000Z',
                genre: 'History'
            };

            // Act
            await bookController.createBook(req, res, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 400,
                message: 'Validation Failed',
                details: ['Author is required and must be a non-empty string']
            });
        });

        it('should return 400 when publishedDate is invalid', async () => {
            // Arrange
            req.body = {
                title: 'New Book',
                author: 'New Author',
                publishedDate: 'invalid-date',
                genre: 'History'
            };

            // Act
            await bookController.createBook(req, res, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 400,
                message: 'Validation Failed',
                details: ['Published date must be a valis ISO date string']
            });
        });

        it('should return 400 when genre is missing', async () => {
            // Arrange
            req.body = {
                title: 'New Book',
                author: 'New Author',
                publishedDate: '2022-01-01T00:00:00.000Z'
            };

            // Act
            await bookController.createBook(req, res, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 400,
                message: 'Validation Failed',
                details: ['Genere is required and must be a non-empty string']
            });
        });

        it('should return 400 with multiple validation errors', async () => {
            // Arrange
            req.body = {
                title: '',
                publishedDate: 'invalid-date'
            };

            // Act
            await bookController.createBook(req, res, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 400,
                message: 'Validation Failed',
                details: expect.arrayContaining([
                    'Title is required and must be a non-empty string',
                    'Author is required and must be a non-empty string',
                    'Published date must be a valis ISO date string',
                    'Genere is required and must be a non-empty string'
                ])
            });
        });

        it('should handle service errors gracefully', async () => {
            // Arrange
            req.body = {
                title: 'New Book',
                author: 'New Author',
                publishedDate: '2022-01-01T00:00:00.000Z',
                genre: 'History'
            };
            jest.spyOn(svc, 'createBook').mockRejectedValue(new Error('Database error'));

            // Act
            await bookController.createBook(req, res, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: 500,
                message: 'Internal Server Error',
                details: ['Database error']
            });
        });
    });

    describe('updateBook', () => {
        it('should update an existing book and return it with status 200', async () => {
            // Arrange
            const existingBook = { id: '1', title: 'Old Book', author: 'Old Author', publishedDate: '2020-01-01T00:00:00.000Z', genre: 'Fiction' };
            repo.books.set('1', existingBook);
            req.params.id = '1';
            req.body = {
                title: 'Updated Book',
                author: 'Updated Author',
                publishedDate: '2023-01-01T00:00:00.000Z',
                genre: 'Non-Fiction'
            };

            // Act
            await bookController.updateBook(req, res, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                id: '1',
                title: 'Updated Book',
                author: 'Updated Author',
                publishedDate: '2023-01-01T00:00:00.000Z',
                genre: 'Non-Fiction'
            }));
        });

        it('should return 404 when trying to update non-existent book', async () => {
            // Arrange
            req.params.id = 'non-existent-id';
            req.body = {
                title: 'Updated Book',
                author: 'Updated Author',
                publishedDate: '2023-01-01T00:00:00.000Z',
                genre: 'Non-Fiction'
            };

            // Act
            await bookController.updateBook(req, res, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                status: 404,
                message: 'Book not found'
            });
        });

        it('should return 400 when validation fails during update', async () => {
            // Arrange
            const existingBook = { id: '1', title: 'Old Book', author: 'Old Author', publishedDate: '2020-01-01T00:00:00.000Z', genre: 'Fiction' };
            repo.books.set('1', existingBook);
            req.params.id = '1';
            req.body = {
                title: '', // Invalid empty title
                author: 'Updated Author',
                publishedDate: '2023-01-01T00:00:00.000Z',
                genre: 'Non-Fiction'
            };

            // Act
            await bookController.updateBook(req, res, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 400,
                message: 'Validation failed',
                details: ['Title is required and must be a non-empty string']
            });
        });

        it('should handle service errors gracefully during update', async () => {
            // Arrange
            req.params.id = '1';
            req.body = {
                title: 'Updated Book',
                author: 'Updated Author',
                publishedDate: '2023-01-01T00:00:00.000Z',
                genre: 'Non-Fiction'
            };
            jest.spyOn(svc, 'updateBook').mockRejectedValue(new Error('Database error'));

            // Act
            await bookController.updateBook(req, res, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: 500,
                message: 'Internal Server Error',
                details: ['Database error']
            });
        });
    });

    describe('deleteBook', () => {
        it('should delete an existing book and return status 204', async () => {
            // Arrange
            const existingBook = { id: '1', title: 'Book to Delete', author: 'Test Author', publishedDate: '2020-01-01T00:00:00.000Z', genre: 'Fiction' };
            repo.books.set('1', existingBook);
            req.params.id = '1';

            // Act
            await bookController.deleteBook(req, res, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        it('should return 404 when trying to delete non-existent book', async () => {
            // Arrange
            req.params.id = 'non-existent-id';

            // Act
            await bookController.deleteBook(req, res, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                status: 404,
                message: 'Book not found'
            });
        });

        it('should handle service errors gracefully during deletion', async () => {
            // Arrange
            req.params.id = '1';
            jest.spyOn(svc, 'deleteBook').mockRejectedValue(new Error('Database error'));

            // Act
            await bookController.deleteBook(req, res, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: 500,
                message: 'Internal Server Error',
                details: ['Database error']
            });
        });
    });

});
