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
const deleteExam_1 = require("./deleteExam");
let generatedExamId;
let generatedQuestionId;
function postNewExam(exam) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = new pg_1.Pool({
            host: "localhost",
            port: 5432,
            database: "postgres",
            user: "postgres",
            password: "kissa123",
        });
        try {
            const client = yield pool.connect();
            ///// Check exam existence
            if (Number(exam.examId)) {
                const existenceResult = yield client.query({
                    text: "SELECT exam_name FROM exams WHERE exam_id = $1",
                    values: [exam.examId],
                });
                const examExists = existenceResult.rows.length > 0;
                //// Delete old exam
                if (examExists && exam.examId) {
                    yield (0, deleteExam_1.deleteExam)(parseInt(exam.examId));
                }
            }
            yield insertExam(client, exam.name, exam.created_at);
            for (const question of exam.questions) {
                yield insertQuestion(client, question.question_text, generatedExamId);
                for (const option of question.options) {
                    let isCorretAnswer = option.answerOptionText === question.correct_answer;
                    yield insertAnswerOption(client, isCorretAnswer, generatedQuestionId, option.answerOptionText);
                }
            }
            client.release();
        }
        catch (err) {
            console.error(err);
            throw new Error(`Inserting to database failed: ${err}`);
        }
        finally {
            yield pool.end();
        }
    });
}
exports.postNewExam = postNewExam;
///--------------------------
const insertQuestion = (client, question_text, exam_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const insertResult = yield client.query({
            text: `
        INSERT INTO questions(question_text, exam_id)
        VALUES($1, $2)
        RETURNING question_id;
        `,
            values: [question_text, exam_id],
        });
        if (insertResult.rows.length > 0) {
            generatedQuestionId = insertResult.rows[0].question_id;
        }
    }
    catch (error) {
        throw new Error(`Inserting or updating into questions failed: ${error}`);
    }
});
///--------------------------
const insertAnswerOption = (client, answerCorrect, question_id, answerText) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield client.query({
            text: `
      INSERT INTO answer_options(answer_text, answer_correct, question_id)
      VALUES($1, $2, $3)
    `,
            values: [answerText, answerCorrect, question_id],
        });
    }
    catch (error) {
        throw new Error(`Inserting into answer options failed: ${error}`);
    }
});
///--------------------------
function insertExam(client, name, createdAt) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updated_at = new Date();
            const published_at = new Date();
            const created_at = new Date(createdAt.toString());
            const insertResult = yield client.query({
                text: `
          INSERT INTO exams(exam_name, created_at, published_at, updated_at)
          VALUES($1, $2, $3, $4)
          RETURNING exam_id;
        `,
                values: [name, created_at, published_at, updated_at],
            });
            if (insertResult.rows.length > 0) {
                generatedExamId = insertResult.rows[0].exam_id;
            }
        }
        catch (error) {
            throw new Error(`Inserting/updating exams failed: ${error}`);
        }
    });
}
