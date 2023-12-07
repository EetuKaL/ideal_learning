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
const app = (0, express_1.default)();
const port = 3001;
/* const quizState = require("../quizState.json"); */
const fs = require("fs");
const { writeFile } = require("fs");
const bcrypt_1 = __importDefault(require("bcrypt"));
const util_1 = require("util");
app.use(express_1.default.json());
const cors_1 = __importDefault(require("cors"));
// Enable All CORS Requests
app.use((0, cors_1.default)());
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let response;
    try {
        let data = yield getData();
        response = { statusCode: 200, body: yield JSON.parse(data) };
    }
    catch (error) {
        response = { statusCode: 500, message: 'Internal server error:' };
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
            let exam = req["body"];
            exam["published_at"] = new Date().toString();
            const data = JSON.parse(yield getData());
            const dataToSave = Object.assign(Object.assign({}, data), { "exams": data["exams"].concat(exam) });
            saveData(JSON.stringify(dataToSave), res);
        }
        catch (error) {
            console.log(error);
        }
        /* bcrypt.compare(authPassword, data["password"]) */
    }
    else {
        res.status(400).send("name or password is missing");
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
        /* bcrypt.compare(authPassword, data["password"]) */
    }
    else {
        res.status(400).send("name or password is missing");
    }
}));
app.put("/createAccount", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.hasOwnProperty("name") && req.headers.hasOwnProperty("password")) {
        try {
            const authName = req.headers["name"];
            const authPassword = req.headers["password"];
            const data = JSON.parse(yield getData());
            let newData = Object.assign(Object.assign({}, data), { account: {
                    name: authName,
                    password: yield hashPassword(authPassword)
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
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
const getData = () => __awaiter(void 0, void 0, void 0, function* () {
    const readFileAsync = (0, util_1.promisify)(fs.readFile);
    const data = yield readFileAsync('./quizState.json', 'utf8');
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
        throw new Error('Password hashing failed');
    }
});
