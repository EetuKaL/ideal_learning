import { Client } from "pg";

export async function fetchExams(examId?: number) {
  const client = new Client({
    host: "localhost",
    port: 5432,
    database: "postgres",
    user: "postgres",
    password: "kissa123",
  });
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

export async function fetchQuestions(examId: number) {
  const client = new Client({
    host: "localhost",
    port: 5432,
    database: "postgres",
    user: "postgres",
    password: "kissa123",
  });
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
  const client = new Client({
    host: "localhost",
    port: 5432,
    database: "postgres",
    user: "postgres",
    password: "kissa123",
  });
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

export async function fetchAndBuildExams() {
  try {
    const exams = await fetchExams();
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
      console.log(examsWithQuestionsAndAnswers);
      return examsWithQuestionsAndAnswers;
    } else {
      console.error("no exams");
      return [];
    }
  } catch (err) {
    console.error(err);
  }
}
