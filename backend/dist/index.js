"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs = require("fs");
const cors_1 = __importDefault(require("cors"));
const middleware_1 = __importDefault(require("./middleware/middleware"));
const https_1 = __importDefault(require("https"));
const selectExam_1 = require("./queries/exam/selectExam");
const deleteExam_1 = require("./queries/exam/deleteExam");
const insertUpdateExam_1 = require("./queries/exam/insertUpdateExam");
const insertUser_1 = require("./queries/user/insertUser");
const hashPassword_1 = __importDefault(require("./utils/hashPassword"));
const selectUser_1 = require("./queries/user/selectUser");
const Errors_1 = require("./Errors");
const bcrypt_1 = __importDefault(require("bcrypt"));
const genrateToken_1 = require("./middleware/genrateToken");
/// Https credentials
var privateKey = fs.readFileSync("./privateKey.key", "utf8");
var certificate = fs.readFileSync("./certificate.crt", "utf8");
var credentials = { key: privateKey, cert: certificate };
/// Start App
const app = (0, express_1.default)();
app.use(express_1.default.json()).use((0, cors_1.default)());
app.get("/", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let response;
    try {
        let user = yield (0, selectExam_1.fetchFullExams)();
        response = { statusCode: 200, body: user };
    }
    catch (error) {
        response = { statusCode: 500, message: "Internal server error:" };
    }
    finally {
        res.json(response);
    }
}));
app.get("/:id", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let response;
    const examId = parseInt(req.params.id);
    try {
        let user = yield (0, selectExam_1.fetchFullExams)(examId);
        response = { statusCode: 200, body: user };
    }
    catch (error) {
        response = { statusCode: 500, message: "Internal server error:" };
    }
    finally {
        res.json(response);
    }
}));
app.post("/", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let exam = req["body"];
        yield (0, insertUpdateExam_1.postExam)(exam);
        res
            .status(200)
            .send({ statusCode: 200, message: "succesfully posted exam" });
    }
    catch (error) {
        res.status(500).send({ statusCode: 500, message: "failed to post exam" });
        console.log(error);
    }
}));
app.delete("/:id", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const examID = req.params.id;
    try {
        if (examID) {
            (0, deleteExam_1.deleteExam)(parseInt(examID));
            res.status(200).json({ message: "Exam deleted successfully" });
        }
    }
    catch (error) {
        res
            .status(500)
            .json({ error: "An error occurred while deleting the exam" });
    }
}));
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body["user_email"] && req.body["user_password"]) {
        try {
            const hashedPassword = yield (0, hashPassword_1.default)(req.body["user_password"].toString());
            yield (0, insertUser_1.registerUser)(req.body["user_email"].toString(), hashedPassword);
            res
                .status(200)
                .send(`Successfully created user: ${req.body["user_email"]}`);
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message === Errors_1.errorDuplicateKey) {
                    res.status(409).send("User is already registered");
                }
                else {
                    res.status(500).send("Internal server error");
                }
            }
        }
    }
    else {
        res.status(400).send("user_id or user_password in the header is missing");
    }
}));
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_email, user_password } = req.body;
        const user = yield (0, selectUser_1.getUser)(user_email);
        if (user && (yield bcrypt_1.default.compare(user_password, user.user_password))) {
            const token = (0, genrateToken_1.genrateToken)(user_email);
            res.status(200).json({ token });
        }
        else {
            res.status(404).send("User or password doesn't match");
        }
    }
    catch (error) {
        res.status(500).send("Internal server error");
    }
}));
var httpsServer = https_1.default.createServer(credentials, app);
httpsServer.listen(3001, () => {
    console.log(`Example app listening on port 3001`);
});
