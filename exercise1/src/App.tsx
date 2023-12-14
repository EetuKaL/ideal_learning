import React, { useEffect } from "react";
import "./App.css";
import NewQuestionScreen from "./screens/NewQuestionScreen";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store";

import ScoreScreen from "./screens/ScoreScreen";
import ExamScreen from "./screens/ExamScreen";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  redirect,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import MainScreen from "./screens/MainScreen";
import { ApplicationState, Exam } from "./types/types";
import {
  check_answers,
  fetchState,
  set_isLoggedIn,
} from "./features/question/questionSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import LoginScreen from "./screens/LoginScreen";
function App() {
  const dispatch = useDispatch();
  const thunkDispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const state = useSelector((state: RootState) => state.exams);
  const navigate = useNavigate();
  const location = useLocation();

  /// Get Selected exam
  const exam: Exam | undefined =
    state.selectedExam !== undefined
      ? state.exams?.find((exam) => exam.examId === state.selectedExam) ??
        state.exams?.[0]
      : state.exams?.[0];

  /// Update state to local storage
  useEffect(() => {
    const updateLocalStorage = (newState: ApplicationState) => {
      localStorage.setItem("state", JSON.stringify(newState));
    };
    try {
      updateLocalStorage(state);
    } catch (error) {
      console.log(error);
    }
  }, [state]);

  /// Check If logged in every time location change.
  /// And if no token automaticaly redirect to "/login"
  useEffect(() => {
    const isLoggedIn = () => {
      const token = localStorage.getItem("token");
      if (token) {
        return true;
      } else {
        return false;
      }
    };

    if (isLoggedIn() === false) {
      navigate("/login");
    }
  }, [location]);

  /// Get exams from database if location is '/'
  useEffect(() => {
    const fetchData = async () => {
      await thunkDispatch(fetchState());
    };
    if (location.pathname === "/") {
      fetchData();
    }
  }, [location]);

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginScreen />} />

        <Route path="/" element={<MainScreen />} />

        {exam != undefined && (
          <>
            <Route path="/exam" element={<ExamScreen exam={exam} />} />
            <Route
              path="/exam/edit"
              element={<NewQuestionScreen exam={exam} />}
            />
            <Route
              path="/exam/create"
              element={<NewQuestionScreen exam={exam} />}
            />
            <Route
              path="/exam/score"
              element={
                <ScoreScreen
                  exam={exam}
                  correctAnswerCount={state.correctAnswersCount}
                />
              }
            />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
