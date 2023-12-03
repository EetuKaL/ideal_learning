import React, { useEffect } from "react";
import "./App.css";
import NewQuestionScreen from "./screens/NewQuestionScreen";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store";

import ScoreScreen from "./screens/ScoreScreen";
import ExamScreen from "./screens/ExamScreen";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import MainScreen from "./screens/MainScreen";
import { ApplicationState, Exam } from "./types/types";
import { fetchState } from "./features/question/questionSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
function App() {
  const dispatch = useDispatch();
  const thunkDispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const state = useSelector((state: RootState) => state.exams);

  const exam: Exam =
    state.selectedExam !== undefined
      ? state.exams.find((exam) => exam.examId === state.selectedExam) ??
        state.exams[0]
      : state.exams[0];

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

  useEffect( () => {
    const fetchData = async () => {
      await thunkDispatch(fetchState()); 
      
    }
    fetchData()
  }, [])

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<MainScreen />} />
          <Route path="/exam" element={<ExamScreen exam={exam} />} />
          <Route
            path="/exam/edit"
            element={<NewQuestionScreen exam={exam} />}
          />
          <Route
            path="/exam/create"
            element={<NewQuestionScreen exam={exam} />}
          />
          <Route path="/exam/score" element={<ScoreScreen exam={exam} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
