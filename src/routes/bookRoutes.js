import { Router } from 'express'

export default function makeBookRoutes(controller) {
    const router = Router()

    router.get('/books', controller.getAllBooks)
    router.get('/books/:id', controller.getBookById)
    router.post('/books', controller.createBook)
    router.put('/books/:id', controller.updateBook)
    router.delete('/books/:id', controller.deleteBook)

    return router
}