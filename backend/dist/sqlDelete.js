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
exports.deleteExam = void 0;
const pg_1 = require("pg");
function deleteExam(exam_id) {
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
            const query = {
                text: `
      DELETE FROM exams WHERE exam_id = $1;
        `,
                values: [exam_id],
            };
            const result = yield client.query(query);
        }
        catch (err) {
            console.error(err);
            throw new Error("Deleting from table failed");
        }
        finally {
            yield client.end();
        }
    });
}
exports.deleteExam = deleteExam;
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
