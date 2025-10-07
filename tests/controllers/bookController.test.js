// const bookController = require('../../src/controllers/bookController');
// const bookModel = require('../../src/models/bookModel.js');
// const { validateBook } = require('../../src/utils/validation.js');
import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import BookController from '../../src/controllers/bookController.js'
import { Service } from '../../src/models/bookModel.js'
// import { validateBook } from '../../src/utils/validation.js';

describe('BookController', () => {
    let req, res, service, controller

    beforeEach(() => {
        service = new Service()
        controller = new BookController(service)

        req = { params: {}, body: {} }
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        }

        // start from clean slate if your Service seeds sample data
        service.books.clear()
    });


    describe('getAllBooks', () => {
        it('should return all books with status 200', () => {
            const mockBooks = [
                { id: '1', title: 'Book 1', author: 'Author 1', publishedDate: '2020-01-01T00:00:00.000Z', genre: 'Fiction' },
                { id: '2', title: 'Book 2', author: 'Author 2', publishedDate: '2021-01-01T00:00:00.000Z', genre: 'Science' },
            ]
            mockBooks.forEach(b => service.books.set(b.id, b))

            controller.getAllBooks(req, res)

            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith(mockBooks)
        })

        it('should return empty array when no books exist', () => {
            controller.getAllBooks(req, res)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith([])
        })
    })
})