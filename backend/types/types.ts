export type Question = {
  deleted?: boolean;
  id: string;
  question_text: string;
  options: AnswerOption[];
  correct_answer: string;
  selected_answer?: string;
  answer_correct?: boolean;
};

export type AnswerOption = {
  deleted?: boolean;
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

export class CustomError extends Error {
  code?: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "CustomError";
    this.code = code;
    // Ensure stack trace is captured for the error
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}
