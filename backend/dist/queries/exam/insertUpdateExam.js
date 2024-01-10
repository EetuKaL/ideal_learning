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
exports.postExam = void 0;
const pg_1 = require("pg");
const deleteExam_1 = require("./deleteExam");
const isNumber_1 = require("../../utils/isNumber");
const sqlCredentials_1 = require("../../sqlCredentials");
let generatedExamId;
let generatedQuestionId;
function postExam(exam, emitMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = new pg_1.Pool(sqlCredentials_1.sqlCredentials);
        const client = yield pool.connect();
        try {
            yield client.query("BEGIN");
            let examID;
            if (exam.examId && (0, isNumber_1.isNumber)(exam.examId)) {
                examID = parseInt(exam.examId);
            }
            client.query('LISTEN notification_channel'); // Replace 'my_channel' with your channel name
            client.on('notification', (msg) => {
                console.log('Received notification:', msg.payload);
                if (msg.payload) {
                    const dbNotify = JSON.parse(msg.payload);
                    emitMessage(dbNotify);
                }
                // Handle the received notification data here
            });
            /// Insert / Update Exam
            yield createExam(client, exam.name, exam.created_at, examID);
            for (const question of exam.questions) {
                let id;
                /// Check that id is number and present
                if (question.id && (0, isNumber_1.isNumber)(question.id)) {
                    id = parseInt(question.id);
                }
                /// If delete tag and id present, delete the question.
                if (question.deleted && id) {
                    yield (0, deleteExam_1.deleteQuestion)(client, id);
                    continue;
                    /// Else Insert / Update question
                }
                else {
                    yield insertQuestion(client, question.question_text, generatedExamId, id);
                }
                for (const option of question.options) {
                    /// Check the correct answer
                    let isCorretAnswer = option.answerOptionText === question.correct_answer;
                    let answerId;
                    /// Check that id is number and present
                    if (option.answerOptionId && (0, isNumber_1.isNumber)(option.answerOptionId)) {
                        answerId = parseInt(option.answerOptionId);
                    }
                    /// If delete tag and id present, delete the answer option.
                    if (option.deleted && answerId) {
                        yield (0, deleteExam_1.deleteAnswerOption)(client, answerId);
                        /// Else Insert / Update Answer option
                    }
                    else {
                        yield insertAnswerOption(client, isCorretAnswer, generatedQuestionId, option.answerOptionText, answerId);
                    }
                }
            }
            yield client.query("COMMIT");
        }
        catch (error) {
            console.log(error);
            yield client.query("ROLLBACK");
            throw new Error("Inserting/Updating an exam failed");
        }
        finally {
            client.release();
            /// Millon katkaistaan yhteys pooliin?
            //await pool.end();
        }
    });
}
exports.postExam = postExam;
///--------------------------
const insertQuestion = (client, question_text, exam_id, question_id) => __awaiter(void 0, void 0, void 0, function* () {
    ///// TRY TO FIND THE QUESTION
    const existenceResult = yield client.query({
        text: "SELECT question_id FROM questions WHERE question_id = $1",
        values: [question_id],
    });
    const questionExists = existenceResult.rows.length > 0;
    let query;
    if (questionExists) {
        query = {
            text: `
          UPDATE questions
          SET question_text = $1
          WHERE question_id = $2
          RETURNING question_id;
        `,
            values: [question_text, question_id],
        };
    }
    else {
        query = {
            text: `
        INSERT INTO questions(question_text, exam_id)
        VALUES($1, $2)
        RETURNING question_id;
        `,
            values: [question_text, exam_id],
        };
    }
    const result = yield client.query(query);
    if (result.rows.length > 0) {
        generatedQuestionId = result.rows[0].question_id;
    }
    else {
        throw Error("Question ID did not return");
    }
});
const insertAnswerOption = (client, answerCorrect, question_id, answerText, answer_id) => __awaiter(void 0, void 0, void 0, function* () {
    let query;
    const existenceResult = yield client.query({
        text: "SELECT answer_text FROM answer_options WHERE answer_id = $1",
        values: [answer_id],
    });
    const answerExists = existenceResult.rows.length > 0;
    if (answerExists) {
        query = {
            text: `
        UPDATE answer_options
        SET answer_text = $1, answer_correct = $2, question_id = $3
        WHERE answer_id = $4
        RETURNING answer_id
    `,
            values: [answerText, answerCorrect, question_id, answer_id],
        };
    }
    else {
        query = {
            text: `
      INSERT INTO answer_options(answer_text, answer_correct, question_id)
      VALUES($1, $2, $3)
    `,
            values: [answerText, answerCorrect, question_id],
        };
    }
    yield client.query(query);
});
///--------------------------
function createExam(client, name, createdAt, examId) {
    return __awaiter(this, void 0, void 0, function* () {
        const updated_at = new Date();
        const published_at = new Date();
        const created_at = new Date(createdAt.toString());
        const existenceResult = yield client.query({
            text: "SELECT exam_name FROM exams WHERE exam_id = $1",
            values: [examId],
        });
        const examExists = existenceResult.rows.length > 0;
        let query;
        if (examExists) {
            query = {
                text: `
          UPDATE exams
          SET exam_name = $1, updated_at = $2
          WHERE exam_id = $3
          RETURNING exam_id;
        `,
                values: [name, published_at, examId],
            };
        }
        else {
            query = {
                text: `
          INSERT INTO exams(exam_name, created_at, published_at, updated_at)
          VALUES($1, $2, $3, $4)
          RETURNING exam_id;
        `,
                values: [name, created_at, published_at, updated_at],
            };
        }
        const result = yield client.query(query);
        if (result.rows.length > 0) {
            generatedExamId = result.rows[0].exam_id;
        }
        else {
            throw Error("Exam ID did not return");
        }
    });
}
