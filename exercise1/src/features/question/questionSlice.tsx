import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
/* import { RootState } from '../types';  */ // Import your RootState type
import { v4 as uid } from "uuid";
import {
  ApplicationState,
  Exam,
  Question,
  defaultValuesCreateQuestion,
} from "../../types/types";
import { current } from "@reduxjs/toolkit";
import { initialState as initState } from "../../data/initialdata";
import { useNavigate } from "react-router-dom";
import { getCurrentDate } from "../../utils/formatDate";

const delay = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const clearCreateQuestionState = (state: ApplicationState) => {
  state.createQuestion.addOptionsInput = "";
  state.createQuestion.createQuestionInput = "";
  state.createQuestion.correct_answer = "";
  state.createQuestion.question_text = "";
  state.createQuestion.answer_options = [];
  state.createQuestion.id = undefined;
};

export const fetchState = createAsyncThunk("exam/fetchState", async () => {
  let result;
  try {
    const response = await fetch("https://localhost:3001/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    result = await response.json();
    console.log(result);
  } catch (error) {
    console.error("Fetch data error:", error);
    throw new Error("Something went wrong with data fetch");
  }
  return result.body;
});

interface LoginPayload {
  name: string;
  password: string;
}

interface LoginResponse {
  token: string; // Adjust the type according to the actual response structure
  // Other properties from your response if any
}

export const login = createAsyncThunk(
  "exam/login",
  async (payload: LoginPayload) => {
    let result;
    const response = await fetch("https://localhost:3001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_email: payload.name,
        user_password: payload.password,
      }),
    });
    if (!response.ok) {
      throw new Error("Login response was not ok");
    }
    const responseData: LoginResponse = await response.json();

    return responseData;
  }
);

const getFromLocal = () => {
  // Check if local storage has the state data
  const localState: string | null = localStorage.getItem("state");
  let parsedState: ApplicationState;
  /*   await delay(1000) */

  if (typeof localState === "string") {
    parsedState = JSON.parse(localState);
  } else {
    parsedState = initState;
  }

  return parsedState;
};

const initialState = getFromLocal;

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

      const examIndex = state.exams!.findIndex(
        (exam) => exam.examId === state.selectedExam
      );
      const exam = state.exams![examIndex];

      const index = exam.questions.findIndex(
        (item) => item.id === selectedQuestion
      );
      exam.questions[index].selected_answer = selected;
    },
    create_question_text: (state) => {
      const examIndex = state.exams!.findIndex(
        (exam) => exam.examId === state.selectedExam
      );
      const exam = state.exams![examIndex];
      state.createQuestion.question_text =
        state.createQuestion.createQuestionInput;
    },
    add_answer_option: (state) => {
      const examIndex = state.exams!.findIndex(
        (exam) => exam.examId === state.selectedExam
      );
      const exam = state.exams![examIndex];
      const updatedOptions = state.createQuestion.answer_options.concat({
        answerOptionText: state.createQuestion.addOptionsInput,
      });
      state.createQuestion.answer_options = updatedOptions;
      state.createQuestion.addOptionsInput = "";
    },
    delete_answer_option: (state, action: PayloadAction<{ index: number }>) => {
      const examIndex = state.exams!.findIndex(
        (exam) => exam.examId === state.selectedExam
      );
      const exam = state.exams![examIndex];
      if (
        state.createQuestion.answer_options[action.payload.index].answerOptionId
      ) {
        state.createQuestion.answer_options[action.payload.index].deleted =
          true;
      } else {
        state.createQuestion.answer_options.splice(action.payload.index, 1);
      }
      state.createQuestion.correct_answer = "";
    },
    select_correct_option: (
      state,
      action: PayloadAction<{ index: number }>
    ) => {
      const examIndex = state.exams!.findIndex(
        (exam) => exam.examId === state.selectedExam
      );
      const exam = state.exams![examIndex];
      state.createQuestion.correct_answer =
        state.createQuestion.answer_options[
          action.payload.index
        ].answerOptionText;
    },
    handle_create_question_input: (
      state,
      action: PayloadAction<{ input: string }>
    ) => {
      const examIndex = state.exams!.findIndex(
        (exam) => exam.examId === state.selectedExam
      );
      const exam = state.exams![examIndex];
      state.createQuestion.createQuestionInput = action.payload.input;
      state.createQuestion.question_text = action.payload.input;
      console.log("current state is: ", current(state));
    },
    handle_add_answer_input: (
      state,
      action: PayloadAction<{ input: string }>
    ) => {
      const examIndex = state.exams!.findIndex(
        (exam) => exam.examId === state.selectedExam
      );
      const exam = state.exams![examIndex];
      state.createQuestion.addOptionsInput = action.payload.input;
    },
    add_question: (state, action: PayloadAction<{ id?: string }>) => {
      const examIndex = state.exams!.findIndex(
        (exam) => exam.examId === state.selectedExam
      );
      const exam = state.exams![examIndex];
      if (action.payload.id) {
        console.log("id in payload");
        const index = exam.questions.findIndex(
          (item) => item.id === action.payload.id
        );

        exam.questions[index] = {
          ...exam.questions[index],
          question_text: state.createQuestion.question_text,
          options: state.createQuestion.answer_options.map((i) => {
            return {
              deleted: i.deleted,
              answerOptionId: i.answerOptionId,
              answerOptionText: i.answerOptionText,
            };
          }),
          correct_answer: state.createQuestion.correct_answer,
        };
        clearCreateQuestionState(state);
      } else {
        console.log("id was not in payload");
        const newQuestion: Question = {
          id: uid(),
          question_text: state.createQuestion.question_text,
          options: state.createQuestion.answer_options.map((i) => {
            return { answerOptionText: i.answerOptionText };
          }),
          correct_answer: state.createQuestion.correct_answer,
        };
        console.log(
          "pushing to exam",
          exam.examId,
          " and the name is: ",
          exam.name
        );

        exam.questions.push(newQuestion);
      }
      clearCreateQuestionState(state);
    },
    clear_create_question_state: (state) => {
      /*       const exam = state.exams.find((i) => i.examId === state.selectedExam); */
      const examIndex = state.exams!.findIndex(
        (exam) => exam.examId === state.selectedExam
      );
      const exam = state.exams![examIndex];
      clearCreateQuestionState(state);
    },
    start_editing: (
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) => {
      const examIndex = state.exams!.findIndex(
        (exam) => exam.examId === state.selectedExam
      );
      const exam = state.exams![examIndex];

      const index = exam.questions.findIndex(
        (item) => item.id === action.payload.id
      );
      const foundQuestion = exam.questions[index];
      // Initial create questions for indicating that we are editing already existing question.
      state.createQuestion.correct_answer = foundQuestion.correct_answer;
      state.createQuestion.question_text = foundQuestion.question_text;
      state.createQuestion.createQuestionInput = foundQuestion.question_text;
      state.createQuestion.answer_options = foundQuestion.options;
      state.createQuestion.id = foundQuestion.id;
    },
    delete_question: (state, action: PayloadAction<{ index: number }>) => {
      const examIndex = state.exams!.findIndex(
        (exam) => exam.examId === state.selectedExam
      );
      const exam = state.exams![examIndex];
      exam.questions[action.payload.index].deleted =
        !exam.questions[action.payload.index].deleted;
    },
    check_answers: (state) => {
      const examIndex = state.exams!.findIndex(
        (exam) => exam.examId === state.selectedExam
      );
      const exam = state.exams![examIndex];
      exam.questions.forEach((question) => {
        if (question.selected_answer === question.correct_answer) {
          question.answer_correct = true;
          if (state.correctAnswersCount) {
            state.correctAnswersCount++;
          } else {
            state.correctAnswersCount = 1;
          }
        } else {
          question.answer_correct = false;
        }
      });
      state.questionsChecked = true;
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
        created_at: getCurrentDate(),
        name: state.create_exam_input_value,
        examId: uid(),
        questions: [],
      };
      state.exams!.push(newExam);
      state.create_exam_input_value = "";
    },
    delete_exam(state) {
      const examIndex = state.exams!.findIndex(
        (exam) => exam.examId === state.selectedExam
      );
      state.exams!.splice(examIndex, 1);
      state.selectedExam = undefined;
    },
    handle_login_input(state, action: PayloadAction<{ input: string }>) {
      state.loginInput = action.payload.input;
    },
    handle_password_input(state, action: PayloadAction<{ input: string }>) {
      state.passwordInput = action.payload.input;
    },
    set_isLoggedIn(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
      state.loggedIn = action.payload.isLoggedIn;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchState.fulfilled, (state, action) => {
      const examsToAdd = state.exams?.filter(
        (localExam: Exam) =>
          !action.payload?.some(
            (fetchedExam: Exam) => localExam.examId === fetchedExam.examId
          )
      );
      state.exams = examsToAdd?.concat(action.payload);
      state.isLoading = false;
    });
    builder.addCase(fetchState.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchState.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      if (action.payload && action.payload.token) {
        localStorage.setItem("token", action.payload.token);
      }
    });
    builder.addCase(login.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
    });
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
  delete_exam,
  handle_login_input,
  handle_password_input,
  set_isLoggedIn,
} = examSlice.actions;

export default examSlice.reducer;
