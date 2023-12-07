"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getTokeFromHeader_1 = __importDefault(require("./getTokeFromHeader"));
const verifyJTWToken_1 = __importDefault(require("./verifyJTWToken"));
const isLogin = (req, res, next) => {
    const token = (0, getTokeFromHeader_1.default)(req);
    let decodedUser;
    if (typeof token === "string") {
        decodedUser = (0, verifyJTWToken_1.default)(token, "secret-key");
    }
    if (!decodedUser) {
        return res.status(400).json({
            code: 400,
            message: "Invalid token or token expired",
            user: decodedUser,
        });
    }
    req.user = decodedUser;
    next();
};
exports.default = isLogin;
