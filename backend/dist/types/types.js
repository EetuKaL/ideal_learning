"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor(message, code) {
        super(message);
        this.name = "CustomError";
        this.code = code;
        // Ensure stack trace is captured for the error
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError);
        }
    }
}
exports.CustomError = CustomError;
