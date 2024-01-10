import { Pool, PoolClient, QueryResult } from "pg";
import { DBNotify, Exam } from "../../types/types";
import { deleteAnswerOption, deleteExam, deleteQuestion } from "./deleteExam";
import { isNumber } from "../../utils/isNumber";
import { sqlCredentials } from "../../sqlCredentials";

let generatedExamId: number;
let generatedQuestionId: number;

export async function postExam(exam: Exam, emitMessage: any) {
  const pool = new Pool(sqlCredentials);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    let examID;

    if (exam.examId && isNumber(exam.examId)) {
      examID = parseInt(exam.examId);
    }

    client.query('LISTEN notification_channel'); // Replace 'my_channel' with your channel name

  client.on('notification', (msg) => {
    console.log('Received notification:', msg.payload);
    if (msg.payload) {
      const dbNotify: DBNotify = JSON.parse(msg.payload)
      emitMessage(dbNotify)

    }
    // Handle the received notification data here
  });
    /// Insert / Update Exam
    await createExam(client, exam.name, exam.created_at, examID);

    for (const question of exam.questions) {
      let id;
      /// Check that id is number and present
      if (question.id && isNumber(question.id)) {
        id = parseInt(question.id);
      }

      /// If delete tag and id present, delete the question.
      if (question.deleted && id) {
        await deleteQuestion(client, id);
        continue;
        /// Else Insert / Update question
      } else {
        await insertQuestion(
          client,
          question.question_text,
          generatedExamId,
          id
        );
      }
      for (const option of question.options) {
        /// Check the correct answer
        let isCorretAnswer =
          option.answerOptionText === question.correct_answer;
        let answerId;
        /// Check that id is number and present
        if (option.answerOptionId && isNumber(option.answerOptionId)) {
          answerId = parseInt(option.answerOptionId);
        }
        /// If delete tag and id present, delete the answer option.
        if (option.deleted && answerId) {
          await deleteAnswerOption(client, answerId);
          /// Else Insert / Update Answer option
        } else {
          await insertAnswerOption(
            client,
            isCorretAnswer,
            generatedQuestionId,
            option.answerOptionText,
            answerId
          );
        }
      }
    }
    await client.query("COMMIT");
  } catch (error) {
    console.log(error)
    await client.query("ROLLBACK");
    throw new Error("Inserting/Updating an exam failed");
  } finally {
    client.release();
    /// Millon katkaistaan yhteys pooliin?
    //await pool.end();
  }
}
///--------------------------
const insertQuestion = async (
  client: PoolClient,
  question_text: String,
  exam_id: number,
  question_id?: number
) => {
  ///// TRY TO FIND THE QUESTION
  const existenceResult: QueryResult = await client.query({
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
  } else {
    query = {
      text: `
        INSERT INTO questions(question_text, exam_id)
        VALUES($1, $2)
        RETURNING question_id;
        `,
      values: [question_text, exam_id],
    };
  }
  const result: QueryResult = await client.query(query);

  if (result.rows.length > 0) {
    generatedQuestionId = result.rows[0].question_id;
  } else {
    throw Error("Question ID did not return");
  }
};

const insertAnswerOption = async (
  client: PoolClient,
  answerCorrect: boolean,
  question_id: number,
  answerText: string,
  answer_id?: number
) => {
  let query;
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

  await client.query(query);
};

///--------------------------
async function createExam(
  client: PoolClient,
  name: String,
  createdAt: String,
  examId?: Number
) {
  const updated_at = new Date();
  const published_at = new Date();
  const created_at = new Date(createdAt.toString());

  const existenceResult: QueryResult = await client.query({
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
  } else {
    query = {
      text: `
          INSERT INTO exams(exam_name, created_at, published_at, updated_at)
          VALUES($1, $2, $3, $4)
          RETURNING exam_id;
        `,
      values: [name, created_at, published_at, updated_at],
    };
  }
  const result: QueryResult = await client.query(query);
  if (result.rows.length > 0) {
    generatedExamId = result.rows[0].exam_id;
  } else {
    throw Error("Exam ID did not return");
  }
}
