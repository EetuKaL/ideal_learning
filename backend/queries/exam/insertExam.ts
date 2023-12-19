import { Pool, PoolClient, QueryResult } from "pg";
import { Exam } from "../../types/types";
import { deleteExam } from "./deleteExam";

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

    ///// Check exam existence
    if (Number(exam.examId)) {
      const existenceResult: QueryResult = await client.query({
        text: "SELECT exam_name FROM exams WHERE exam_id = $1",
        values: [exam.examId],
      });

      const examExists = existenceResult.rows.length > 0;
      //// Delete old exam
      if (examExists && exam.examId) {
        await deleteExam(parseInt(exam.examId));
      }
    }
    await insertExam(client, exam.name, exam.created_at);
    for (const question of exam.questions) {
      await insertQuestion(client, question.question_text, generatedExamId);
      for (const option of question.options) {
        let isCorretAnswer =
          option.answerOptionText === question.correct_answer;
        await insertAnswerOption(
          client,
          isCorretAnswer,
          generatedQuestionId,
          option.answerOptionText
        );
      }
    }
    client.release();
  } catch (err) {
    console.error(err);
    throw new Error(`Inserting to database failed: ${err}`);
  } finally {
    await pool.end();
  }
}
///--------------------------
const insertQuestion = async (
  client: PoolClient,
  question_text: String,
  exam_id: number
) => {
  try {
    const insertResult: QueryResult = await client.query({
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
  } catch (error) {
    throw new Error(`Inserting or updating into questions failed: ${error}`);
  }
};
///--------------------------
const insertAnswerOption = async (
  client: PoolClient,
  answerCorrect: boolean,
  question_id: number,
  answerText: string
) => {
  try {
    const result = await client.query({
      text: `
      INSERT INTO answer_options(answer_text, answer_correct, question_id)
      VALUES($1, $2, $3)
    `,
      values: [answerText, answerCorrect, question_id],
    });
  } catch (error) {
    throw new Error(`Inserting into answer options failed: ${error}`);
  }
};

///--------------------------
async function insertExam(client: PoolClient, name: String, createdAt: String) {
  try {
    const updated_at = new Date();
    const published_at = new Date();
    const created_at = new Date(createdAt.toString());
    const insertResult: QueryResult = await client.query({
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
  } catch (error) {
    throw new Error(`Inserting/updating exams failed: ${error}`);
  }
}
