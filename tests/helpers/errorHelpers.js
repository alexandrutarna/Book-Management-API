/**
 * Test helper functions for standardized error responses
 */

/**
 * Create expected error response structure for tests
 * @param {number} code - Error code
 * @param {string} message - Error message  
 * @param {string[]} details - Error details array
 * @returns {Object} Expected error response structure
 */
const createExpectedError = (code, message, details = []) => ({
    error: {
        code,
        message,
        details: Array.isArray(details) ? details : [details].filter(Boolean)
    }
});

/**
 * Common expected error responses for tests
 */
const ExpectedErrors = {
    internalError: (details = ['Database error']) =>
        createExpectedError(500, 'Internal server error', details),

    bookNotFound: (id = '') => {
        const message = id ? `Book with ID '${id}' not found` : 'Book not found';
        return createExpectedError(404, message);
    },

    validationFailed: (details = []) =>
        createExpectedError(400, 'Validation Failed', details),

    badRequest: (message = 'Bad Request', details = []) =>
        createExpectedError(400, message, details),

    notFound: (message = 'Resource not found', details = []) =>
        createExpectedError(404, message, details)
};

module.exports = {
    createExpectedError,
    ExpectedErrors
};