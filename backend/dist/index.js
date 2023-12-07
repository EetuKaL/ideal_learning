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
const uuid_1 = require("uuid");
const app = (0, express_1.default)();
const port = 3001;
/* const quizState = require("../quizState.json"); */
const fs = require("fs");
const { writeFile } = require("fs");
const bcrypt_1 = __importDefault(require("bcrypt"));
const util_1 = require("util");
app.use(express_1.default.json());
const cors_1 = __importDefault(require("cors"));
const genrateToken_1 = require("./genrateToken");
const middleware_1 = __importDefault(require("./middleware"));
// Enable All CORS Requests
app.use((0, cors_1.default)());
app.get("/", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let response;
    try {
        let data = yield getData();
        response = { statusCode: 200, body: yield JSON.parse(data) };
    }
    catch (error) {
        response = { statusCode: 500, message: "Internal server error:" };
    }
    finally {
        res.json(response);
    }
}));
app.post("/initialData", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req["body"].hasOwnProperty("exams")) {
        try {
            saveData(JSON.stringify(req["body"]), res);
        }
        catch (error) {
            console.log(error);
        }
    }
    else {
        res.send({
            statusCode: 500,
            message: " in the request body was 'exams' property missing \n check if there is typos",
        });
    }
}));
app.put("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.hasOwnProperty("name") &&
        req.headers.hasOwnProperty("password")) {
        try {
            const data = JSON.parse(yield getData());
            const password = req["headers"]["password"];
            const name = req["headers"]["name"];
            if (yield checkAuthentication(name, password)) {
                let exam = req["body"];
                exam["published_at"] = new Date().toString();
                const dataToSave = Object.assign(Object.assign({}, data), { exams: data["exams"].concat(exam) });
                saveData(JSON.stringify(dataToSave), res);
            }
            else {
                res.status(400).send("wrong username or password");
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    else {
        res.status(400).send("name or password is missing in headers");
    }
}));
app.put("/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.hasOwnProperty("name") &&
        req.headers.hasOwnProperty("password")) {
        if (req.body.hasOwnProperty("id")) {
            try {
                const id = req["body"]["id"];
                const data = JSON.parse(yield getData());
                const newData = Object.assign(Object.assign({}, data), { exams: data.exams.filter((exam) => exam.examId !== id) });
                saveData(JSON.stringify(newData), res);
            }
            catch (error) {
                console.log(error);
            }
        }
    }
    else {
        res.status(400).send("name or password is missing");
    }
}));
app.post("/createAccount", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (req.headers.hasOwnProperty("name") &&
        req.headers.hasOwnProperty("password")) {
        try {
            const authName = req.headers["name"];
            const authPassword = (_a = req.headers["password"]) === null || _a === void 0 ? void 0 : _a.toString();
            const data = JSON.parse(yield getData());
            const hashedPassword = yield hashPassword(authPassword);
            let newData = Object.assign(Object.assign({}, data), { account: {
                    id: (0, uuid_1.v4)(),
                    name: authName,
                    password: hashedPassword,
                } });
            saveData(JSON.stringify(newData), res);
        }
        catch (error) {
            console.log(error);
            res.status(500).send("Internal server error");
        }
    }
    else {
        res.status(400).send("Name or password header is missing");
    }
}));
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, password } = req.body;
    console.log(req);
    const data = JSON.parse(yield getData());
    if (typeof password !== "string") {
        throw new Error("Password not a string");
    }
    if (data["account"]["name"] === name &&
        (yield bcrypt_1.default.compare(password, data["account"]["password"]))) {
        // If authentication is successful, generate a JWT token
        const token = (0, genrateToken_1.genrateToken)(data["account"]["id"]);
        // Send the token in the response
        res.status(200).json({ token });
    }
    else {
        res.status(400).send("wrong username or password");
    }
}));
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
const getData = () => __awaiter(void 0, void 0, void 0, function* () {
    const readFileAsync = (0, util_1.promisify)(fs.readFile);
    const data = yield readFileAsync("./quizState.json", "utf8");
    return data;
});
const saveData = (data, res) => {
    writeFile("./quizState.json", data, (error) => {
        if (error) {
            return res.status(500).send("Error when posting data in the server");
        }
        res.status(200).send({ statusCode: 200, message: "Post was succesfull" });
    });
};
const hashPassword = (plaintextPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10;
    try {
        const hash = yield bcrypt_1.default.hash(plaintextPassword, saltRounds);
        return hash;
    }
    catch (error) {
        // Handle error
        throw new Error("Password hashing failed");
    }
});
const checkAuthentication = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    const data = JSON.parse(yield getData());
    if (typeof password !== "string") {
        throw new Error("Password not a string");
    }
    if (data["account"]["name"] === name &&
        (yield bcrypt_1.default.compare(password, data["account"]["password"]))) {
        return true;
    }
    else {
        return false;
    }
});
