// error class
export class ApiError {
    constructor(statusCode, message, details = []) {
        this.statusCode = statusCode;
        this.message = message;
        this.details = details;
    }

    toJSON() {
        return {
            statusCode: this.statusCode,
            message: this.message,
            details: this.details
        };
    }
}


// export the ApiError class
// module.exports = ApiError;
export default ApiError;