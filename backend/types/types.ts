export type Question = {
  id: string;
  question_text: string;
  options: AnswerOption[];
  correct_answer: string;
  selected_answer?: string;
  answer_correct?: boolean;
};

export type AnswerOption = {
  answerOptionId?: string;
  answerOptionText: string;
};

export type Exam = {
  created_at: String;
  published_at?: String;
  updated_at?: String;
  examId?: string;
  name: string;
  questions: Question[];
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
