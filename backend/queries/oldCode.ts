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
    if (exam.examId) {
      deleteExam(parseInt(exam.examId));
    }

    const client = await pool.connect();

    let examID;

    if (exam.examId) {
      examID = parseInt(exam.examId);
    }
    console.log("bodyna saatu examid: ", examID);
    await createExam(client, exam.name, exam.created_at, examID);

    for (const question of exam.questions) {
      let id;
      try {
        if (question.id) {
          id = parseInt(question.id);
        }
      } catch (error) {
        throw new Error("Question ID was not a number");
      }

      await createQuestion(client, question.question_text, generatedExamId, id);

      for (const option of question.options) {
        let answerId;
        if (option.answerOptionId) {
          answerId = parseInt(option.answerOptionId);
        }
        if (option.answerOptionText === question.correct_answer) {
          await createAnswerOption(
            client,
            true,
            generatedQuestionId,
            option.answerOptionText,
            answerId
          );
        } else {
          await createAnswerOption(
            client,
            false,
            generatedQuestionId,
            option.answerOptionText,
            answerId
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
    ///// TRY TO FIND THE QUESTION
    const existenceResult: QueryResult = await client.query({
      text: "SELECT question_id FROM questions WHERE question_id = $1",
      values: [question_id],
    });
    const questionExists = existenceResult.rows.length > 0;
    console.log("====================================");
    console.log("qUESTION ID: ", existenceResult);

    console.log("QUESTION EXISTS ", questionExists);
    console.log("====================================");
    //// QUESTION EXISTS
    if (questionExists) {
      console.log("updating");
      const updateQuery = {
        text: `
          UPDATE questions
          SET question_text = $1
          WHERE question_id = $2
          RETURNING question_id;
        `,
        values: [question_text, question_id],
      };
      const updateResult: QueryResult = await client.query(updateQuery);
      if (updateResult.rows.length > 0) {
        generatedQuestionId = updateResult.rows[0].question_id;
      }
      //// QUESTION DOESNT EXIST
    } else {
      console.log("inserting");
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
    let query;
    console.log("====================================");
    console.log("TRYING TO FIND ANSWER : ", answer_id);
    console.log("====================================");

    ///// TRY TO FIND THE QUESTION
    const existenceResult: QueryResult = await client.query({
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
    } else {
      query = {
        text: `
      INSERT INTO answer_options(answer_text, answer_correct, question_id)
      VALUES($1, $2, $3)
    `,
        values: [answerText, answerCorrect, question_id],
      };
    }

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

    ///// TRY TO FIND THE EXAM
    const existenceResult: QueryResult = await client.query({
      text: "SELECT exam_name FROM exams WHERE exam_id = $1",
      values: [examId],
    });
    const examExists = existenceResult.rows.length > 0;
    console.log("====================================");
    console.log("Exam id: ", examId);
    console.log("exam exists: ", examExists);
    console.log("Exam: :", existenceResult);

    console.log("====================================");
    //// EXAM EXISTS
    if (examExists) {
      const updateQuery = {
        text: `
          UPDATE exams
          SET exam_name = $1, updated_at = $2
          WHERE exam_id = $3
          RETURNING exam_id;
        `,
        values: [name, published_at, examId],
      };
      const updateResult: QueryResult = await client.query(updateQuery);

      if (updateResult.rows.length > 0) {
        generatedExamId = updateResult.rows[0].exam_id;
      }
      //// EXAM DOESN'T EXIST
    } else {
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
    }
  } catch (error) {
    throw new Error(`Inserting/updating exams failed: ${error}`);
  }
}
