import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import BookController from '../../src/controllers/bookController.js'
import { Service } from '../../src/models/bookModel.js'
import * as validation from '../../src/utils/validation.js'

// tiny factory for a mocked service (unit tests shouldn't hit real storage)
function makeService(overrides = {}) {
    return {
        getAll: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        ...overrides,
    }
}

// minimal Express-like res mock
function makeRes() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
    }
}


describe('BookController', () => {
    let req, res, service, controller

    // beforeEach(() => {
    //     service = new Service()
    //     controller = new BookController(service)

    //     req = { params: {}, body: {} }
    //     res = {
    //         status: jest.fn().mockReturnThis(),
    //         json: jest.fn().mockReturnThis(),
    //         send: jest.fn().mockReturnThis(),
    //     }

    //     // start from clean slate if your Service seeds sample data
    //     service.books.clear()
    // });



    beforeEach(() => {
        service = makeService()
        controller = new BookController(service)
        req = { params: {}, body: {} }
        res = makeRes()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })


    describe('createBook', () => {
        it('creates a book with valid data', () => {
            const validBook = {
                title: 'Clean Architecture',
                author: 'Robert C. Martin',
                publishedDate: '2017-09-20T00:00:00.000Z',
                genre: 'Programming',
            }
            req.body = validBook

            const created = { ...validBook, id: 'abc-123' }
            service.create.mockReturnValue(created) // controller calls service.create on success

            // Spy on the real validator (no mocking of behavior, just verify call)
            const validateSpy = jest.spyOn(validation, 'validateBook')

            controller.createBook(req, res)

            expect(validateSpy).toHaveBeenCalledWith(validBook)
            expect(service.create).toHaveBeenCalledWith(validBook)
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith(created)
        })

    })
})