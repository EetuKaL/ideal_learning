/* import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from '../types';  // Import your RootState type
import { v4 as uid } from "uuid";
import {
  Question,
  ApplicationState,
  defaultValuesCreateQuestion,
  defaultValuesExamState,
} from "../../types/types";
import { current } from "@reduxjs/toolkit";

const clearCreateApplicationState = (state: ApplicationState) => {
  state.exams[0].createQuestion.addOptionsInput = "";
  state.exams[0].createQuestion.createQuestionInput = "";
  state.exams[0].createQuestion.correct_answer = "";
  state.exams[0].createQuestion.question_text = "";
  state.exams[0].createQuestion.answer_options = [];
  state.exams[0].createQuestion.id = undefined;
  state.exams[0].showAddQuestionModal = false;
};

const initState: ApplicationState = {
  exams: [
    {
      ...defaultValuesExamState,
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

export const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {},
});

export const {} = questionSlice.actions;

export default questionSlice.reducer;
 */
