const { ErrorResponses } = require('../utils/errorResponse');

/**
 * Global error handling middleware
 * Catches any unhandled errors and sends standardized error responses
 * 
 * @param {Error} error - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (error, req, res, next) => {
    // Log the error for debugging (in production, use proper logging)
    console.error('Unhandled error:', error);

    // If response already sent, delegate to default Express error handler
    if (res.headersSent) {
        return next(error);
    }

    // Handle specific error types
    if (error.name === 'ValidationError') {
        return ErrorResponses.validationFailed(res, [error.message]);
    }

    if (error.name === 'CastError') {
        return ErrorResponses.badRequest(res, 'Invalid ID format', [error.message]);
    }

    if (error.code === 11000) { // MongoDB duplicate key error
        return ErrorResponses.conflict(res, 'Resource already exists', [error.message]);
    }

    // Default to internal server error
    ErrorResponses.internalError(res, 'Internal server error', [error.message]);
};

/**
 * 404 Not Found middleware for unmatched routes
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const notFoundHandler = (req, res, next) => {
    ErrorResponses.notFound(res, `Route ${req.originalUrl} not found`);
};

module.exports = {
    errorHandler,
    notFoundHandler
};