/**
 * Validates the book data.
 * @param {Object} bookData - The book object to validate.
 * @returns {Object} {isValid: boolean, errors: string[]} - An object containing validation results.
 */
const validateBook = (bookData) => {
    const { title, author, publishedDate, genre } = bookData;
    const errors = [];

    // Validate title
    if (!title || typeof title !== 'string' || title.trim() === '') {
        errors.push('Title is required and must be a non-empty string');
    }

    // Validate author
    if (!author || typeof author !== 'string' || author.trim() === '') {
        errors.push('Author is required and must be a non-empty string');
    }

    // Validate publishedDate
    if (!publishedDate) {
        errors.push('Published date is required');
    } else {
        const date = new Date(publishedDate);
        if (isNaN(date.getTime())) {
            errors.push('Published date must be a valis ISO date string');
        }
    }

    // Validate genre
    if (!genre || typeof genre !== 'string' || genre.trim() === '') {
        errors.push('Genere is required and must be a non-empty string');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

module.exports = { validateBook };