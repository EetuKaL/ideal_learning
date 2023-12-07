"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Function to verify the token
const verifyToken = (token, secretKey) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        return decoded;
    }
    catch (error) {
        // Handle token verification error here
        if (error) {
            console.error("Error verifying token:");
        }
        return null;
    }
};
exports.default = verifyToken;
