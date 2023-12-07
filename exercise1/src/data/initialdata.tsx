import {
  ApplicationState,
  defaultValuesCreateQuestion,
  defaultValuesExamState,
} from "../types/types";
import { v4 as uid } from "uuid";

export const initialState: ApplicationState = {
  loggedIn: false,
  create_exam_input_value: "",
  allQuestionAnswered: false,
  questionsChecked: false,
  createQuestion: { ...defaultValuesCreateQuestion, answer_options: [] },
  isLoading: false,
  exams: [
    {
      ...defaultValuesExamState,
      created_at: new Date(),
      name: "initialQuiz",
      examId: uid(),
      questions: [
        {
          id: uid(),
          question_text: "What is the capital of France?",
          options: ["London", "Paris", "Berlin", "Rome"],
          correct_answer: "Paris",
        },
        {
          id: uid(),
          question_text: "Who painted the Mona Lisa?",
          options: [
            "Vincent van Gogh",
            "Pablo Picasso",
            "Leonardo da Vinci",
            "Michelangelo",
          ],
          correct_answer: "Leonardo da Vinci",
        },
        {
          id: uid(),
          question_text: "Which planet is known as the Red Planet?",
          options: ["Mars", "Venus", "Jupiter", "Mercury"],
          correct_answer: "Mars",
        },
      ],
    },
    {
      ...defaultValuesExamState,
      name: "initialQuiz-2",
      created_at: new Date(),
      examId: uid(),
      questions: [
        {
          id: uid(),
          question_text: "What is the capital of Germany?",
          options: ["London", "Paris", "Berlin", "Rome"],
          correct_answer: "Berlin",
        },
        {
          id: uid(),
          question_text: "Who painted the somethhing?",
          options: [
            "Vincent van Gogh",
            "Pablo Picasso",
            "Leonardo da Vinci",
            "Michelangelo",
          ],
          correct_answer: "Leonardo da Vinci",
        },
        {
          id: uid(),
          question_text: "Which planet is known as the ?",
          options: ["Mars", "Venus", "Jupiter", "Mercury"],
          correct_answer: "Mars",
        },
      ],
    },
  ],
};
