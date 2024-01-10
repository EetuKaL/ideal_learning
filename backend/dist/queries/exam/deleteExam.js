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
exports.deleteAnswerOption = exports.deleteQuestion = exports.deleteExam = void 0;
const pg_1 = require("pg");
const sqlCredentials_1 = require("../../sqlCredentials");
function deleteExam(exam_id, emitMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = new pg_1.Pool(sqlCredentials_1.sqlCredentials);
        const client = yield pool.connect();
        try {
            yield client.query("BEGIN");
            client.query('LISTEN notification_channel'); // Replace 'my_channel' with your channel name
            const query = {
                text: `
      DELETE FROM exams WHERE exam_id = $1;
      `,
                values: [exam_id],
            };
            client.on('notification', (msg) => {
                if (msg.payload) {
                    const dbNotify = JSON.parse(msg.payload);
                    emitMessage(dbNotify);
                }
            });
            const result = yield client.query(query);
            yield client.query("COMMIT");
        }
        catch (err) {
            console.log(err);
            yield client.query("ROLLBACK");
            throw new Error("Deleting from table failed");
        }
        finally {
            console.log("Succesfuly Deleted Exam");
            client.release();
        }
    });
}
exports.deleteExam = deleteExam;
function deleteQuestion(client, question_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = {
                text: `
      DELETE FROM questions WHERE question_id = $1;
        `,
                values: [question_id],
            };
            const result = yield client.query(query);
        }
        catch (err) {
            console.error(err);
            throw new Error("Deleting from table failed");
        }
        finally {
            console.log("Succesfuly Deleted Question");
        }
    });
}
exports.deleteQuestion = deleteQuestion;
function deleteAnswerOption(client, answer_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = {
                text: `
      DELETE FROM answer_options WHERE answer_id = $1;
        `,
                values: [answer_id],
            };
            const result = yield client.query(query);
        }
        catch (err) {
            console.error(err);
            throw new Error("Deleting from table failed");
        }
        finally {
            console.log("Succesfuly Deleted Answer Option");
        }
    });
}
exports.deleteAnswerOption = deleteAnswerOption;
/* SELECT
      e.id AS exam_id,
      e.name,
      (
        SELECT
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'question_id', q.id,
              'question_text', q.question_text,
              'answer_options', (
                SELECT
                  JSON_AGG(
                    JSON_BUILD_OBJECT(
                      'answer_option_id', ao.id,
                      'answer_text', ao.answer_text,
                      'is_correct', ao.is_correct
                    )
                  )
                FROM
                  answer_option ao
                WHERE
                  ao.question_id = q.id
              )
            )
          )
        FROM
          question q
        WHERE
          q.exam_id = e.id
      ) AS questions
    FROM
      exam e
    ORDER BY
      e.id */
