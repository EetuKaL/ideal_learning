import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uid } from "uuid";
import { ApplicationState, Exam, Question } from "../../types/types";
import { current } from "@reduxjs/toolkit";
import { initialState as initState } from "../../data/initialdata";
import { getCurrentDate } from "../../utils/formatDate";

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
    if (!response.ok) {
      throw new Error(response.status.toString());
    }
    result = await response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "400") {
        throw error.message;
      } else {
        throw new Error("Something went wrong with data fetch");
      }
    }
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
    try {
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
        throw new Error(response.statusText);
      }
      const responseData: LoginResponse = await response.json();

      return responseData;
    } catch (error) {
      if (error instanceof Error) {
        throw error.message;
      } else {
        throw "Internal server error";
      }
    }
  }
);

interface RegisterPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export const register = createAsyncThunk(
  "exam/register",
  async (payload: RegisterPayload) => {
    try {
      const response = await fetch("https://localhost:3001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_email: payload.email,
          user_password: payload.password,
          user_firstName:
            payload.firstName && payload.firstName.length > 0
              ? payload.firstName
              : undefined,
          user_lastName:
            payload.lastName && payload.lastName.length > 0
              ? payload.lastName
              : undefined,
        }),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.statusText;
    } catch (error) {
      if (error instanceof Error) {
        throw error.message;
      } else {
        throw "Internal server error";
      }
    }
  }
);

const getFromLocal = () => {
  // Check if local storage has the state data
  const localState: string | null = localStorage.getItem("state");
  let parsedState: ApplicationState;

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
        const newQuestion: Question = {
          id: uid(),
          question_text: state.createQuestion.question_text,
          options: state.createQuestion.answer_options.map((i) => {
            return { answerOptionText: i.answerOptionText };
          }),
          correct_answer: state.createQuestion.correct_answer,
        };

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
    handle_email_input(state, action: PayloadAction<{ input: string }>) {
      state.emailInput = action.payload.input;
    },
    handle_password_input(state, action: PayloadAction<{ input: string }>) {
      state.passwordInput = action.payload.input;
    },
    handle_passwordAgain_input(
      state,
      action: PayloadAction<{ input: string }>
    ) {
      state.passwordAgainInput = action.payload.input;
    },
    handle_firstName_input(state, action: PayloadAction<{ input: string }>) {
      state.firstNameInput = action.payload.input;
    },
    handle_LastName_input(state, action: PayloadAction<{ input: string }>) {
      state.lastNameInput = action.payload.input;
    },
    set_isLoggedIn(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
      state.loggedIn = action.payload.isLoggedIn;
    },
    set_showDeletePopup(state, action: PayloadAction<{ show: boolean }>) {
      state.showDeletePopup = action.payload.show;
    },
    set_showPublishPopup(state, action: PayloadAction<{ show: boolean }>) {
      state.showPublishPopup = action.payload.show;
    },
    swich_between_login_register(
      state,
      action: PayloadAction<{ isLoginIn: boolean }>
    ) {
      state.isLogingIn = action.payload.isLoginIn;
    },
    set_error_message(
      state,
      action: PayloadAction<{ message: string | null }>
    ) {
      state.errorMessage = action.payload.message;
    },
    set_success_message(
      state,
      action: PayloadAction<{ message: string | null }>
    ) {
      state.successMessage = action.payload.message;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchState.fulfilled, (state, action) => {
      // do not include local exam if published tag and not in fetched exams
      const examsToAdd = state.exams
        ? state.exams
            ?.filter((item) => item !== null)
            .filter((localExam) => !localExam.published_at)
            .filter(
              (localExam: Exam) =>
                !action.payload?.some(
                  (fetchedExam: Exam) => localExam.examId === fetchedExam.examId
                )
            )
        : [];
        console.log("Exams to Add: ")
      state.exams = examsToAdd?.concat(action.payload);
      state.isLoading = false;
    });
    builder.addCase(fetchState.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchState.rejected, (state, action) => {
      if (action.error.message === "400") {
        localStorage.removeItem("token");
      } 
      state.errorMessage = action.error.message;
      state.isLoading = false;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      if (action.payload && action.payload.token) {
        localStorage.setItem("token", action.payload.token);
      }
      state.isLoading = false;
    });
    builder.addCase(login.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.errorMessage = action.error.message;
      state.isLoading = false;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.successMessage = action.payload;
      state.isLogingIn = true;
      state.isLoading = false;
    });
    builder.addCase(register.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.errorMessage = action.error.message;
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
  handle_email_input,
  handle_password_input,
  handle_passwordAgain_input,
  handle_firstName_input,
  handle_LastName_input,
  set_isLoggedIn,
  set_showDeletePopup,
  set_showPublishPopup,
  swich_between_login_register,
  set_error_message,
  set_success_message,
} = examSlice.actions;

export default examSlice.reducer;
