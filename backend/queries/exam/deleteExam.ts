import { Client, PoolClient } from "pg";

export async function deleteExam(exam_id: number) {
  const client = new Client({
    host: "localhost",
    port: 5432,
    database: "postgres",
    user: "postgres",
    password: "kissa123",
  });

  try {
    await client.connect();
    const query = {
      text: `
      DELETE FROM exams WHERE exam_id = $1;
        `,
      values: [exam_id],
    };
    const result = await client.query(query);
  } catch (err) {
    console.error(err);
    throw new Error("Deleting from table failed");
  } finally {
    console.log("Succesfuly Deleted Exam");
    await client.end();
  }
}

export async function deleteQuestion(client: PoolClient, question_id: number) {
  try {
    const query = {
      text: `
      DELETE FROM questions WHERE question_id = $1;
        `,
      values: [question_id],
    };
    const result = await client.query(query);
  } catch (err) {
    console.error(err);
    throw new Error("Deleting from table failed");
  } finally {
    console.log("Succesfuly Deleted Question");
  }
}

export async function deleteAnswerOption(
  client: PoolClient,
  answer_id: number
) {
  try {
    const query = {
      text: `
      DELETE FROM answer_options WHERE answer_id = $1;
        `,
      values: [answer_id],
    };
    const result = await client.query(query);
  } catch (err) {
    console.error(err);
    throw new Error("Deleting from table failed");
  } finally {
    console.log("Succesfuly Deleted Answer Option");
  }
}

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
