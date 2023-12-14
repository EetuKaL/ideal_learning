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
  created_at: Date | String;
  published_at?: Date;
  updated_at?: Date;
  examId: string;
  name: string;
  questions: Question[];
};

export type ApplicationState = {
  allQuestionAnswered: boolean;
  questionsChecked: boolean;
  correctAnswersCount?: number;
  isLoading: boolean;
  createQuestion: CreateQuestion;
  create_exam_input_value: string;
  selectedExam?: string;
  exams?: Exam[];
  loginInput?: string;
  passwordInput?: string;
  loggedIn: boolean;
};

export type CreateQuestion = {
  id?: string;
  question_text: string;
  answer_options: AnswerOption[];
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
