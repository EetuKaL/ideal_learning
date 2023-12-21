import {
  ApplicationState,
  defaultValuesCreateQuestion,
  defaultValuesExamState,
} from "../types/types";
import { v4 as uid } from "uuid";

export const initialState: ApplicationState = {
  isLogingIn: true,
  loggedIn: false,
  create_exam_input_value: "",
  allQuestionAnswered: false,
  questionsChecked: false,
  createQuestion: { ...defaultValuesCreateQuestion, answer_options: [] },
  isLoading: false,
  showDeletePopup: false,
  showPublishPopup: false,
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
          options: [
            { answerOptionId: uid(), answerOptionText: "London" },
            { answerOptionId: uid(), answerOptionText: "Paris" },
            { answerOptionId: uid(), answerOptionText: "Berlin" },
            { answerOptionId: uid(), answerOptionText: "Rome" },
          ],
          correct_answer: "Paris",
        },
        {
          id: uid(),
          question_text: "Who painted the Mona Lisa?",
          options: [
            { answerOptionId: uid(), answerOptionText: "Pablo Picasso" },
            { answerOptionId: uid(), answerOptionText: "Leonardo da Vinci" },
            { answerOptionId: uid(), answerOptionText: "Michelangelo" },
            { answerOptionId: uid(), answerOptionText: "Leonardo da Vinci" },
          ],
          correct_answer: "Leonardo da Vinci",
        },
        {
          id: uid(),
          question_text: "Which planet is known as the Red Planet?",
          options: [
            { answerOptionId: uid(), answerOptionText: "Mars" },
            { answerOptionId: uid(), answerOptionText: "Venus" },
            { answerOptionId: uid(), answerOptionText: "Jupiter" },
            { answerOptionId: uid(), answerOptionText: "Mercury" },
          ],
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
          options: [
            { answerOptionId: uid(), answerOptionText: "London" },
            { answerOptionId: uid(), answerOptionText: "Paris" },
            { answerOptionId: uid(), answerOptionText: "Berlin" },
            { answerOptionId: uid(), answerOptionText: "Rome" },
          ],
          correct_answer: "Berlin",
        },
        {
          id: uid(),
          question_text: "Who painted the somethhing?",
          options: [
            { answerOptionId: uid(), answerOptionText: "Pablo Picasso" },
            { answerOptionId: uid(), answerOptionText: "Leonardo da Vinci" },
            { answerOptionId: uid(), answerOptionText: "Michelangelo" },
            { answerOptionId: uid(), answerOptionText: "Leonardo da Vinci" },
          ],
          correct_answer: "Leonardo da Vinci",
        },
        {
          id: uid(),
          question_text: "Which planet is known as the ?",
          options: [
            { answerOptionId: uid(), answerOptionText: "Mars" },
            { answerOptionId: uid(), answerOptionText: "Venus" },
            { answerOptionId: uid(), answerOptionText: "Jupiter" },
            { answerOptionId: uid(), answerOptionText: "Mercury" },
          ],
          correct_answer: "Mars",
        },
      ],
    },
  ],
};
