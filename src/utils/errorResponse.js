/**
 * Standardized error response utility that matches OpenAPI specification
 * Creates consistent error responses across the entire application
 */

/**
 * Create a standardized error response object
 * @param {number} code - HTTP status code
 * @param {string} message - Error message
 * @param {string[]} details - Array of detailed error messages (optional)
 * @returns {Object} Standardized error response object
 */
const createErrorResponse = (code, message, details = []) => {
    return {
        error: {
            code,
            message,
            details: Array.isArray(details) ? details : [details].filter(Boolean)
        }
    };
};

/**
 * Send a standardized error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {string|string[]} details - Error details (optional)
 */
const sendErrorResponse = (res, statusCode, message, details = []) => {
    const errorResponse = createErrorResponse(statusCode, message, details);
    res.status(statusCode).json(errorResponse);
};

/**
 * Predefined error response helpers for common HTTP errors
 */
const ErrorResponses = {
    /**
     * 400 Bad Request - Validation or malformed request
     */
    badRequest: (res, message = 'Bad Request', details = []) => {
        sendErrorResponse(res, 400, message, details);
    },

    /**
     * 404 Not Found - Resource not found
     */
    notFound: (res, message = 'Resource not found', details = []) => {
        sendErrorResponse(res, 404, message, details);
    },

    /**
     * 500 Internal Server Error - Server errors
     */
    internalError: (res, message = 'Internal server error', details = []) => {
        sendErrorResponse(res, 500, message, details);
    },

    /**
     * 401 Unauthorized
     */
    unauthorized: (res, message = 'Unauthorized', details = []) => {
        sendErrorResponse(res, 401, message, details);
    },

    /**
     * 403 Forbidden
     */
    forbidden: (res, message = 'Forbidden', details = []) => {
        sendErrorResponse(res, 403, message, details);
    },

    /**
     * 409 Conflict
     */
    conflict: (res, message = 'Conflict', details = []) => {
        sendErrorResponse(res, 409, message, details);
    },

    /**
     * Validation error helper - specifically for validation failures
     */
    validationFailed: (res, validationErrors = []) => {
        sendErrorResponse(res, 400, 'Validation Failed', validationErrors);
    },

    /**
     * Book not found - specific helper for book resources
     */
    bookNotFound: (res, bookId = '') => {
        const message = bookId ? `Book with ID '${bookId}' not found` : 'Book not found';
        sendErrorResponse(res, 404, message);
    }
};

module.exports = {
    createErrorResponse,
    sendErrorResponse,
    ErrorResponses
};