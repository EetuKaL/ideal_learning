"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genrateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const genrateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, "secret-key", { expiresIn: "30m" });
};
exports.genrateToken = genrateToken;
