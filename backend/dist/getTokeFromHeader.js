"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//create. getTokenFromHeader.js  file
const getTokenFromHeader = (req) => {
    if (!req.headers.authorization) {
        return {
            status: "Failed",
            message: "Authorization header not found",
        };
    }
    const token = req.headers.authorization.split(" ")[1];
    return token;
};
exports.default = getTokenFromHeader;
