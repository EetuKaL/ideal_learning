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
  set_success_message,
} from "./features/question/questionSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import LoginScreen from "./screens/LoginScreen";
import Redirect from "./components/Redirect";
import ErrorMessage from "./components/ErrorMessage";
import SuccessMessage from "./components/SuccesMessage";
import io from 'socket.io-client';

function App() {
  
  const dispatch = useDispatch();
  const thunkDispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const state = useSelector((state: RootState) => state.exams);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const socket = io('https://localhost:3001');  // Replace with your Socket.IO server URL

    socket.on('connect', () => {
      console.log('Connected to the server');
      socket.on('messageFromServer', (data: any) => {
        // Temp solution to notify from database changes. mb show popup to fetch changes?
        dispatch(set_success_message({message: data.data}))
      })
      socket.emit('messageFromClient', {data: "Socket is opened"})
    });
    // Other socket event listeners and handling can be added here

    return () => {
      socket.disconnect();
    };
  }, []);

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
    const fetchData = async () => {
      await thunkDispatch(fetchState());
    };

    if (isLoggedIn() === false) {
      navigate("/login");
    }
    if (isLoggedIn() && location.pathname === "/") {
      fetchData();
    }
  }, [location.pathname]);

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
        <Route path="*" element={<Redirect />} />
      </Routes>
      {state.errorMessage && <ErrorMessage />}
      {state.successMessage && <SuccessMessage />}
    </div>
  );
}

export default App;
