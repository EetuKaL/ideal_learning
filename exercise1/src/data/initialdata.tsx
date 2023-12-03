import { ApplicationState, defaultValuesCreateQuestion, defaultValuesExamState } from "../types/types";
import { v4 as uid } from "uuid";

export const initialState: ApplicationState = {
    create_exam_input_value: "",
    isLoading: false,
    exams: [
      {
        ...defaultValuesExamState,
        name: "initialQuiz",
        createQuestion: { ...defaultValuesCreateQuestion, answer_options: [] },
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
        createQuestion: { ...defaultValuesCreateQuestion, answer_options: [] },
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

