export type Question = {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  selected_answer?: string;
  answer_correct?: boolean;
};

export type Exam = {
  examId: string;
  name: string;
  questions: Question[];
  createQuestion: CreateQuestion;
  allQuestionAnswered: boolean;
  showAddQuestionModal: boolean;
  questionsChecked: boolean;
  correctAnswersCount?: number;
};

export type CreateQuestion = {
  id?: string;
  question_text: string;
  answer_options: string[];
  correct_answer: string;
  createQuestionInput: string;
  addOptionsInput: string;
};

export const defaultValuesCreateQuestion = {
  question_text: "",
  answer_options: "",
  correct_answer: "",
  createQuestionInput: "",
  addOptionsInput: "",
};

export const defaultValuesExamState = {
  allQuestionAnswered: false,
  showAddQuestionModal: false,
  questionsChecked: false,
};