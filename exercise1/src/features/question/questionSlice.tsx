import { createSlice, PayloadAction } from "@reduxjs/toolkit";
/* import { RootState } from '../types';  */ // Import your RootState type
import { v4 as uid } from "uuid";
import {
  ApplicationState,
  Exam,
  Question,
  defaultValuesCreateQuestion,
  defaultValuesExamState,
} from "../../types/types";
import { current } from "@reduxjs/toolkit";

const clearCreateQuestionState = (exam: Exam) => {
  exam.createQuestion.addOptionsInput = "";
  exam.createQuestion.createQuestionInput = "";
  exam.createQuestion.correct_answer = "";
  exam.createQuestion.question_text = "";
  exam.createQuestion.answer_options = [];
  exam.createQuestion.id = undefined;
  exam.showAddQuestionModal = false;
};

const initState: ApplicationState = {
  create_exam_input_value: "",
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

// Check if local storage has the state data
const localState: string | null = localStorage.getItem("state");
let parsedState: ApplicationState | null = null;

if (localState) {
  try {
    parsedState = JSON.parse(localState);
  } catch (error) {
    console.error("Error parsing local storage data:", error);
    parsedState = null;
  }
}

// Use the parsed state if it exists; otherwise, use the initial state
const initialState = parsedState || initState;

export const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    select_option: (
      state,
      action: PayloadAction<{
        selectedQuestion: string;
        selected: string;
      }>
    ) => {
      const { selectedQuestion, selected } = action.payload;

      const examIndex = state.exams.findIndex(
        (exam) => exam.examId === state.selectedExam
      );
      const exam = state.exams[examIndex];

      const index = exam.questions.findIndex(
        (item) => item.id === selectedQuestion
      );
      exam.questions[index].selected_answer = selected;
    },
    create_question_text: (state) => {
      const examIndex = state.exams.findIndex(
        (exam) => exam.examId === state.selectedExam
      );
      const exam = state.exams[examIndex];
      exam.createQuestion.question_text =
        exam.createQuestion.createQuestionInput;
    },
    add_answer_option: (state) => {
      const examIndex = state.exams.findIndex(
        (exam) => exam.examId === state.selectedExam
      );
      const exam = state.exams[examIndex];
      const updatedOptions = exam.createQuestion.answer_options.concat(
        exam.createQuestion.addOptionsInput
      );
      exam.createQuestion.answer_options = updatedOptions;
      exam.createQuestion.addOptionsInput = "";
    },
    delete_answer_option: (state, action: PayloadAction<{ index: number }>) => {
      const examIndex = state.exams.findIndex(
        (exam) => exam.examId === state.selectedExam
      );
      const exam = state.exams[examIndex];
      exam.createQuestion.answer_options.splice(action.payload.index, 1);
      exam.createQuestion.correct_answer = "";
    },
    select_correct_option: (
      state,
      action: PayloadAction<{ index: number }>
    ) => {
      const examIndex = state.exams.findIndex(
        (exam) => exam.examId === state.selectedExam
      );
      const exam = state.exams[examIndex];
      exam.createQuestion.correct_answer =
        exam.createQuestion.answer_options[action.payload.index];
    },
    handle_create_question_input: (
      state,
      action: PayloadAction<{ input: string }>
    ) => {
      const examIndex = state.exams.findIndex(
        (exam) => exam.examId === state.selectedExam
      );
      const exam = state.exams[examIndex];
      exam.createQuestion.createQuestionInput = action.payload.input;
      exam.createQuestion.question_text = action.payload.input;
      console.log("current state is: ", current(state));
    },
    handle_add_answer_input: (
      state,
      action: PayloadAction<{ input: string }>
    ) => {
      const examIndex = state.exams.findIndex(
        (exam) => exam.examId === state.selectedExam
      );
      const exam = state.exams[examIndex];
      exam.createQuestion.addOptionsInput = action.payload.input;
    },
    add_question: (state, action: PayloadAction<{ id?: string }>) => {
      const examIndex = state.exams.findIndex(
        (exam) => exam.examId === state.selectedExam
      );
      const exam = state.exams[examIndex];
      if (action.payload.id) {
        const index = exam.questions.findIndex(
          (item) => item.id === action.payload.id
        );

        exam.questions[index] = {
          ...exam.questions[index],
          question_text: exam.createQuestion.question_text,
          options: exam.createQuestion.answer_options,
          correct_answer: exam.createQuestion.correct_answer,
        };
        clearCreateQuestionState(exam);
      } else {
        const newQuestion: Question = {
          id: uid(),
          question_text: exam.createQuestion.question_text,
          options: exam.createQuestion.answer_options,
          correct_answer: exam.createQuestion.correct_answer,
        };
        exam.questions.push(newQuestion);
      }
      clearCreateQuestionState(exam);
    },
    clear_create_question_state: (state) => {
      /*       const exam = state.exams.find((i) => i.examId === state.selectedExam); */
      const examIndex = state.exams.findIndex(
        (exam) => exam.examId === state.selectedExam
      );
      const exam = state.exams[examIndex];
      clearCreateQuestionState(exam);
    },
    start_editing: (
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) => {
      const examIndex = state.exams.findIndex(
        (exam) => exam.examId === state.selectedExam
      );
      const exam = state.exams[examIndex];

      const index = exam.questions.findIndex(
        (item) => item.id === action.payload.id
      );
      const foundQuestion = exam.questions[index];
      // Initial create questions for indicating that we are editing already existing question.
      exam.createQuestion.correct_answer = foundQuestion.correct_answer;
      exam.createQuestion.question_text = foundQuestion.question_text;
      exam.createQuestion.createQuestionInput = foundQuestion.question_text;
      exam.createQuestion.answer_options = foundQuestion.options;
      exam.createQuestion.id = foundQuestion.id;
    },
    delete_question: (state, action: PayloadAction<{ index: number }>) => {
      const examIndex = state.exams.findIndex(
        (exam) => exam.examId === state.selectedExam
      );
      const exam = state.exams[examIndex];
      exam.questions.splice(action.payload.index, 1);
    },
    check_answers: (state) => {
      const examIndex = state.exams.findIndex(
        (exam) => exam.examId === state.selectedExam
      );
      const exam = state.exams[examIndex];
      exam.questions.forEach((question) => {
        if (question.selected_answer === question.correct_answer) {
          question.answer_correct = true;
          if (exam.correctAnswersCount) {
            exam.correctAnswersCount++;
          } else {
            exam.correctAnswersCount = 1;
          }
        } else {
          question.answer_correct = false;
        }
      });
      exam.questionsChecked = true;
    },
    reset_state: (state) => initState,
    initial_state_from_local_storage(
      state,
      action: PayloadAction<{ newState: ApplicationState }>
    ) {
      state = action.payload.newState;
    },
    select_exam(state, action: PayloadAction<{ selectedExamId: string }>) {
      state.selectedExam = action.payload.selectedExamId;
    },
    handle_create_exam_input(state, action: PayloadAction<{ input: string }>) {
      state.create_exam_input_value = action.payload.input;
    },
    create_exam(state) {
      const newExam: Exam = {
        ...defaultValuesExamState,
        createQuestion: { ...defaultValuesCreateQuestion, answer_options: [] },
        name: state.create_exam_input_value,
        examId: uid(),
        questions: [],
      };
      state.exams.push(newExam);
    },
  },
});

export const {
  select_option,
  handle_create_question_input,
  create_question_text,
  add_answer_option,
  select_correct_option,
  handle_add_answer_input,
  add_question,
  delete_question,
  check_answers,
  reset_state,
  initial_state_from_local_storage,
  delete_answer_option,
  start_editing,
  clear_create_question_state,
  select_exam,
  handle_create_exam_input,
  create_exam,
} = examSlice.actions;

export default examSlice.reducer;
