import { error } from "console";
import { Client } from "pg";
import { sqlCredentials } from "../../sqlCredentials";

export async function fetchExams(examId?: number) {
  const client = new Client(sqlCredentials);
  try {
    await client.connect();

    let result;

    if (examId) {
      const selectedId = examId;
      const query = {
        text: "SELECT exam_name, exam_id, published_at, updated_at, created_at FROM public.exams WHERE exam_id = $1",
        values: [selectedId],
      };
      result = await client.query(query);
    } else {
      const query = {
        text: "SELECT exam_name, exam_id, published_at, updated_at, created_at FROM public.exams",
      };
      result = await client.query(query);
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
  } catch (err) {
    console.error(err);
    throw new Error("Fetching Exams Failed")
  } finally {
    await client.end();
  }
}

export async function fetchQuestions(examId: number) {
  const client = new Client(sqlCredentials);
  try {
    await client.connect();

    const selectedId = examId;

    const query = {
      text: "SELECT question_text, exam_id, question_id FROM public.questions WHERE exam_id = $1",
      values: [selectedId],
    };

    const result = await client.query(query);

    const questions = result.rows.map((question) => {
      return {
        id: question.question_id,
        question_text: question.question_text,
      };
    });

    return questions;
  } catch (err) {
    console.error(err);
    return [];
  } finally {
    await client.end();
  }
}

export async function fetchAnswerOptions(questionId: number) {
  const client = new Client(sqlCredentials);
  try {
    await client.connect();

    const selectedId = questionId;

    const query = {
      text: "SELECT answer_text, answer_correct, answer_id, question_id FROM public.answer_options WHERE question_id = $1",
      values: [selectedId],
    };

    const result = await client.query(query);

    const answerOptions = result.rows.map((answer) => {
      return {
        answerText: answer.answer_text,
        answerCorrect: answer.answer_correct,
        answerId: answer.answer_id,
      };
    });

    return answerOptions;
  } catch (err) {
    console.error(err);
    return [];
  } finally {
    await client.end();
  }
}

export async function fetchFullExams(id?: number) {
  try {
    const exams = await fetchExams(id);
    if (exams) {
      const examsWithQuestionsAndAnswers = await Promise.all(
        exams.map(async (exam) => {
          const questions = await fetchQuestions(exam.examId);
          const updatedQuestions = await Promise.all(
            questions.map(async (question) => {
              const answerOptions = await fetchAnswerOptions(question.id);
              const options = answerOptions.map((answerOption) => {
                return {
                  answerOptionText: answerOption.answerText,
                  answerOptionId: answerOption.answerId,
                };
              });

              const correctAnswer = answerOptions.find(
                (option) => option.answerCorrect
              );

              return {
                ...question,
                options,
                correct_answer: correctAnswer?.answerText,
              };
            })
          );

          return {
            ...exam,
            questions: updatedQuestions,
          };
        })
      );
   
      return examsWithQuestionsAndAnswers;
    } else {
      console.error("no exams");
      return [];
    }
  } catch (err) {
    
    throw new Error("Fetching exams failed")
  }
}

export async function fetchExamsWithSingleQuery(examId?: number) {
  const client = new Client(sqlCredentials);
  try {
    await client.connect();

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
    result = await client.query(query);

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
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}
