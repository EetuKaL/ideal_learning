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
Object.defineProperty(exports, "__esModule", { value: true });
exports.postNewExam = void 0;
const pg_1 = require("pg");
let generatedExamId;
let generatedQuestionId;
function postNewExam(exam) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new pg_1.Client({
            host: "localhost",
            port: 5432,
            database: "postgres",
            user: "postgres",
            password: "kissa123",
        });
        try {
            yield client.connect();
            yield createExam(client, exam.name, exam.created_at);
            for (const question of exam.questions) {
                yield createQuestion(client, question.question_text, generatedExamId);
                for (const option of question.options) {
                    if (option.answerOptionText === question.correct_answer) {
                        yield createAnswerOption(client, true, generatedQuestionId, option.answerOptionText);
                    }
                    else {
                        yield createAnswerOption(client, false, generatedQuestionId, option.answerOptionText);
                    }
                }
            }
        }
        catch (err) {
            console.error(err);
            throw new Error("Inserting to database failed");
        }
        finally {
            yield client.end();
        }
    });
}
exports.postNewExam = postNewExam;
const createQuestion = (client, question_text, exam_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = {
            text: "INSERT INTO questions(question_text, exam_id) VALUES($1, $2) RETURNING question_id",
            values: [question_text, exam_id],
        };
        const result = yield client.query(query);
        if (result.rows.length > 0) {
            generatedQuestionId = result.rows[0].question_id;
        }
        else {
            throw new Error("Inserting into questions failed: Failed to retrieve generated exam ID.");
        }
    }
    catch (error) {
        throw new Error(`Inserting into questions failed: ${error}`);
    }
});
const createAnswerOption = (client, answerCorrect, question_id, answerText) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = {
            text: "INSERT INTO answer_options(answer_text, answer_correct, question_id) VALUES($1, $2, $3)",
            values: [answerText, answerCorrect, question_id],
        };
        const result = yield client.query(query);
    }
    catch (error) {
        throw new Error(`Inserting into answer options failed: ${error}`);
    }
});
const createExam = (client, name, createdAt) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const created_at = new Date(createdAt.toString());
        const published_at = new Date();
        const updated_at = new Date();
        const query = {
            text: "INSERT INTO exams(exam_name, created_at, published_at, updated_at) VALUES($1, $2, $3, $4) RETURNING exam_id",
            values: [name, created_at, published_at, updated_at],
        };
        const result = yield client.query(query);
        if (result.rows.length > 0) {
            generatedExamId = result.rows[0].exam_id;
        }
        else {
            throw new Error("Inserting into exams failed: Failed to retrieve generated exam ID.");
        }
    }
    catch (error) {
        throw new Error(`Inserting into exams failed: ${error}`);
    }
});
