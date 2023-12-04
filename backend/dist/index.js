"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3001;
const quizState = require("../quizState.json");
const fs = require("fs");
const { writeFile } = require("fs");
app.use(express_1.default.json());
app.get("/", (req, res) => {
    fs.readFile("./quizState.json", "utf8", (error, data) => {
        if (error) {
            return res.status(500).send("Error when gettin data in the server");
        }
        res.status(200).send({ statusCode: 200, body: JSON.parse(data) });
    });
});
app.post("/", (req, res) => {
    if (req.body.hasOwnProperty("exams")) {
        writeFile("./quizState.json", JSON.stringify(req.body), (error) => {
            if (error) {
                return res.status(500).send("Error when posting data in the server");
            }
            res.status(200).send({ statusCode: 200, message: "Post was succesfull" });
        });
    }
    else {
        res.send({
            statusCode: 500,
            message: " in the request body was 'exams' property missing \n check if there is typos",
        });
    }
});
app.put("/", (req, res) => {
    if (req.headers.hasOwnProperty("name") &&
        req.headers.hasOwnProperty("password")) {
        const authName = req.headers.name;
        const authPassword = req.headers.password;
        if (authName === "mikko" && authPassword === "12345") {
            res.status(200).send(`Welcome user: ${authName}`);
        }
        else {
            res.status(401).send("Unauthorized");
        }
    }
    else {
        res.status(400).send("name or password header is missing");
    }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
