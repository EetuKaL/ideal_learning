import { Pool, PoolClient, QueryResult } from "pg";
import { Exam } from "../types/types";
import { deleteExam } from "./deleteExam";
import { log } from "console";

let generatedExamId: number;
let generatedQuestionId: number;

export async function postNewExam(exam: Exam) {
  const pool = new Pool({
    host: "localhost",
    port: 5432,
    database: "postgres",
    user: "postgres",
    password: "kissa123",
  });

  try {
    const client = await pool.connect();

    ///// TRY TO FIND THE EXAM
    if (Number(exam.examId)) {
      const existenceResult: QueryResult = await client.query({
        text: "SELECT exam_name FROM exams WHERE exam_id = $1",
        values: [exam.examId],
      });

      const examExists = existenceResult.rows.length > 0;

      if (examExists && exam.examId) {
        await deleteExam(parseInt(exam.examId));
      }
    }
    await createExam(client, exam.name, exam.created_at);

    for (const question of exam.questions) {
      await createQuestion(client, question.question_text, generatedExamId);

      for (const option of question.options) {
        if (option.answerOptionText === question.correct_answer) {
          await createAnswerOption(
            client,
            true,
            generatedQuestionId,
            option.answerOptionText
          );
        } else {
          await createAnswerOption(
            client,
            false,
            generatedQuestionId,
            option.answerOptionText
          );
        }
      }
    }
    client.release();
  } catch (err) {
    console.error(err);
    throw new Error("Inserting to database failed");
  } finally {
    console.log("====================================");
    console.log("looped all");
    console.log("====================================");
    await pool.end();
  }
}
///--------------------------
const createQuestion = async (
  client: PoolClient,
  question_text: String,
  exam_id: number,
  question_id?: number
) => {
  try {
    const insertQuery = {
      text: `
        INSERT INTO questions(question_text, exam_id)
        VALUES($1, $2)
        RETURNING question_id;
        `,
      values: [question_text, exam_id],
    };
    const insertResult: QueryResult = await client.query(insertQuery);
    if (insertResult.rows.length > 0) {
      generatedQuestionId = insertResult.rows[0].question_id;
    }
  } catch (error) {
    throw new Error(`Inserting or updating into questions failed: ${error}`);
  }
};

const createAnswerOption = async (
  client: PoolClient,
  answerCorrect: boolean,
  question_id: number,
  answerText: string,
  answer_id?: number
) => {
  try {
    const query = {
      text: `
      INSERT INTO answer_options(answer_text, answer_correct, question_id)
      VALUES($1, $2, $3)
    `,
      values: [answerText, answerCorrect, question_id],
    };

    const result = await client.query(query);
  } catch (error) {
    throw new Error(`Inserting into answer options failed: ${error}`);
  }
};

///--------------------------
async function createExam(
  client: PoolClient,
  name: String,
  createdAt: String,
  examId?: Number
) {
  try {
    const updated_at = new Date();
    const published_at = new Date();
    const created_at = new Date(createdAt.toString());

    const insertQuery = {
      text: `
          INSERT INTO exams(exam_name, created_at, published_at, updated_at)
          VALUES($1, $2, $3, $4)
          RETURNING exam_id;
        `,
      values: [name, created_at, published_at, updated_at],
    };
    const insertResult: QueryResult = await client.query(insertQuery);
    if (insertResult.rows.length > 0) {
      generatedExamId = insertResult.rows[0].exam_id;
    }
  } catch (error) {
    throw new Error(`Inserting/updating exams failed: ${error}`);
  }
}
