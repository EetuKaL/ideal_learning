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
exports.fetchExamsWithSingleQuery = exports.fetchFullExams = exports.fetchAnswerOptions = exports.fetchQuestions = exports.fetchExams = void 0;
const pg_1 = require("pg");
function fetchExams(examId) {
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
            let result;
            if (examId) {
                const selectedId = examId;
                const query = {
                    text: "SELECT exam_name, exam_id, published_at, updated_at, created_at FROM public.exams WHERE exam_id = $1",
                    values: [selectedId],
                };
                result = yield client.query(query);
            }
            else {
                const query = {
                    text: "SELECT exam_name, exam_id, published_at, updated_at, created_at FROM public.exams",
                };
                result = yield client.query(query);
            }
            const exams = result.rows.map((exam) => {
                return {
                    examId: exam.exam_id,
                    name: exam.exam_name,
                    created_at: exam.created_at,
                    published_at: exam.published_at,
                    updated_at: exam.updated_at,
                };
            });
            return exams;
        }
        catch (err) {
            console.error(err);
        }
        finally {
            yield client.end();
        }
    });
}
exports.fetchExams = fetchExams;
function fetchQuestions(examId) {
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
            const selectedId = examId;
            const query = {
                text: "SELECT question_text, exam_id, question_id FROM public.questions WHERE exam_id = $1",
                values: [selectedId],
            };
            const result = yield client.query(query);
            const questions = result.rows.map((question) => {
                return {
                    id: question.question_id,
                    question_text: question.question_text,
                };
            });
            return questions;
        }
        catch (err) {
            console.error(err);
            return [];
        }
        finally {
            yield client.end();
        }
    });
}
exports.fetchQuestions = fetchQuestions;
function fetchAnswerOptions(questionId) {
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
            const selectedId = questionId;
            const query = {
                text: "SELECT answer_text, answer_correct, answer_id, question_id FROM public.answer_options WHERE question_id = $1",
                values: [selectedId],
            };
            const result = yield client.query(query);
            const answerOptions = result.rows.map((answer) => {
                return {
                    answerText: answer.answer_text,
                    answerCorrect: answer.answer_correct,
                    answerId: answer.answer_id,
                };
            });
            return answerOptions;
        }
        catch (err) {
            console.error(err);
            return [];
        }
        finally {
            yield client.end();
        }
    });
}
exports.fetchAnswerOptions = fetchAnswerOptions;
function fetchFullExams(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const exams = yield fetchExams(id);
            if (exams) {
                const examsWithQuestionsAndAnswers = yield Promise.all(exams.map((exam) => __awaiter(this, void 0, void 0, function* () {
                    const questions = yield fetchQuestions(exam.examId);
                    const updatedQuestions = yield Promise.all(questions.map((question) => __awaiter(this, void 0, void 0, function* () {
                        const answerOptions = yield fetchAnswerOptions(question.id);
                        const options = answerOptions.map((answerOption) => {
                            return {
                                answerOptionText: answerOption.answerText,
                                answerOptionId: answerOption.answerId,
                            };
                        });
                        const correctAnswer = answerOptions.find((option) => option.answerCorrect);
                        return Object.assign(Object.assign({}, question), { options, correct_answer: correctAnswer === null || correctAnswer === void 0 ? void 0 : correctAnswer.answerText });
                    })));
                    return Object.assign(Object.assign({}, exam), { questions: updatedQuestions });
                })));
                console.log(examsWithQuestionsAndAnswers);
                return examsWithQuestionsAndAnswers;
            }
            else {
                console.error("no exams");
                return [];
            }
        }
        catch (err) {
            console.error(err);
        }
    });
}
exports.fetchFullExams = fetchFullExams;
function fetchExamsWithSingleQuery(examId) {
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
            let result;
            const query = {
                text: `
        SELECT 
          e.exam_id,
          e.exam_name,
          e.published_at,
          e.updated_at,
          e.created_at,
          q.question_text,
          q.question_id,
          a.answer_text,
          a.answer_correct,
          a.answer_id
        FROM 
          exams e
        LEFT JOIN 
          questions q ON e.exam_id = q.exam_id
        LEFT JOIN 
          answer_options a ON q.question_id = a.question_id;
        `,
            };
            result = yield client.query(query);
            let exam_id;
            const exams = result.rows.map((exam) => {
                return {
                    examId: exam.exam_id,
                    name: exam.exam_name,
                    created_at: exam.created_at,
                    published_at: exam.published_at,
                    updated_at: exam.updated_at,
                    questions: [
                        {
                            question_text: exam.question_text,
                            question_id: exam.question_id,
                            options: [
                                { answer_text: exam.answer_text, answer_id: exam.answer_id },
                            ],
                        },
                    ],
                };
            });
            /*   if (examId) {
              console.log(exams[0]);
              return exams[0];
            } else {
              console.log(exams);
              return exams;
            } */
            return exams;
        }
        catch (err) {
            console.error(err);
        }
        finally {
            yield client.end();
        }
    });
}
exports.fetchExamsWithSingleQuery = fetchExamsWithSingleQuery;
