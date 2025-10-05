const bookController = require('../../src/controllers/bookController');
const bookModel = require('../../src/models/bookModel');

describe('BookController', () => {
    let req, res;

    beforeEach(() => {
        // Setup mock request and response objects before each test
        req = {
            params: {},
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        };

        // Clear all books before each test
        bookModel.books.clear();
    });

    describe('getAllBooks', () => {
        it('should return all books with status 200', () => {
            // Arrange: Create test data
            const mockBooks = [
                {
                    id: '1',
                    title: 'Book 1',
                    author: 'Author 1',
                    publishedDate: '2020-01-01T00:00:00.000Z',
                    genre: 'Fiction'
                },
                {
                    id: '2',
                    title: 'Book 2',
                    author: 'Author 2',
                    publishedDate: '2021-01-01T00:00:00.000Z',
                    genre: 'Science'
                }
            ];
            mockBooks.forEach(book => bookModel.books.set(book.id, book));

            // Act: Call the controller method
            bookController.getAllBooks(req, res);

            // Assert: Check the results
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockBooks);
        });

        it('should return empty array when no books exist', () => {
            bookController.getAllBooks(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([]);
        });
    });

    describe('getBookById', () => {
        it('should return a book when valid id is provided', () => {
            const mockBook = {
                id: 'test-id',
                title: 'Test Book',
                author: 'Test Author',
                publishedDate: '2020-01-01T00:00:00.000Z',
                genre: 'Fiction'
            };
            bookModel.books.set(mockBook.id, mockBook);
            req.params.id = 'test-id';

            bookController.getBookById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockBook);
        });

        it('should return 404 when book is not found', () => {
            req.params.id = 'non-existent-id';

            bookController.getBookById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                status: 404,
                message: 'Book not found'
            });
        });
    });

    describe('createBook', () => {
        it('should create a new book with valid data', () => {
            const validBook = {
                title: 'New Book',
                author: 'New Author',
                publishedDate: '2023-01-01T00:00:00.000Z',
                genre: 'Fantasy'
            };
            req.body = validBook;

            bookController.createBook(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    ...validBook,
                    id: expect.any(String)
                })
            );
        });

        it('should return 400 when title is missing', () => {
            req.body = {
                author: 'Test Author',
                publishedDate: '2023-01-01T00:00:00.000Z',
                genre: 'Fiction'
            };

            bookController.createBook(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 400,
                    message: 'Validation Failed',
                    details: expect.arrayContaining([
                        expect.stringContaining('Title')
                    ])
                })
            );
        });

        it('should return 400 when author is missing', () => {
            req.body = {
                title: 'Test Book',
                publishedDate: '2023-01-01T00:00:00.000Z',
                genre: 'Fiction'
            };

            bookController.createBook(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 400,
                    message: 'Validation Failed',
                    details: expect.arrayContaining([
                        expect.stringContaining('Author')
                    ])
                })
            );
        });

        it('should return 400 when publishedDate is invalid', () => {
            req.body = {
                title: 'Test Book',
                author: 'Test Author',
                publishedDate: 'invalid-date',
                genre: 'Fiction'
            };

            bookController.createBook(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 400,
                    message: 'Validation Failed',
                    details: expect.arrayContaining([
                        expect.stringContaining('date')
                    ])
                })
            );
        });

        it('should return 400 when multiple fields are missing', () => {
            req.body = {
                genre: 'Fiction'
            };

            bookController.createBook(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            const callArgs = res.json.mock.calls[0][0];
            expect(callArgs.status).toBe(400);
            expect(callArgs.details.length).toBeGreaterThan(1);
        });
    });

    describe('updateBook', () => {
        it('should update a book with valid data', () => {
            const existingBook = {
                id: 'test-id',
                title: 'Old Title',
                author: 'Old Author',
                publishedDate: '2020-01-01T00:00:00.000Z',
                genre: 'Fiction'
            };
            bookModel.books.set(existingBook.id, existingBook);

            req.params.id = 'test-id';
            req.body = {
                title: 'Updated Title',
                author: 'Updated Author',
                publishedDate: '2023-01-01T00:00:00.000Z',
                genre: 'Science'
            };

            bookController.updateBook(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: 'test-id',
                    title: 'Updated Title',
                    author: 'Updated Author'
                })
            );
        });

        it('should return 404 when updating non-existent book', () => {
            req.params.id = 'non-existent-id';
            req.body = {
                title: 'Test',
                author: 'Test',
                publishedDate: '2023-01-01T00:00:00.000Z',
                genre: 'Test'
            };

            bookController.updateBook(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                status: 404,
                message: 'Book not found'
            });
        });

        it('should return 400 when update data is invalid', () => {
            const existingBook = {
                id: 'test-id',
                title: 'Test',
                author: 'Test',
                publishedDate: '2020-01-01T00:00:00.000Z',
                genre: 'Test'
            };
            bookModel.books.set(existingBook.id, existingBook);

            req.params.id = 'test-id';
            req.body = {
                title: '',
                author: 'Test',
                publishedDate: '2023-01-01T00:00:00.000Z',
                genre: 'Test'
            };

            bookController.updateBook(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('deleteBook', () => {
        it('should delete a book and return 204', () => {
            const mockBook = {
                id: 'test-id',
                title: 'Test',
                author: 'Test',
                publishedDate: '2020-01-01T00:00:00.000Z',
                genre: 'Test'
            };
            bookModel.books.set(mockBook.id, mockBook);
            req.params.id = 'test-id';

            bookController.deleteBook(req, res);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
            expect(bookModel.books.has('test-id')).toBe(false);
        });

        it('should return 404 when deleting non-existent book', () => {
            req.params.id = 'non-existent-id';

            bookController.deleteBook(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                status: 404,
                message: 'Book not found'
            });
        });
    });
});