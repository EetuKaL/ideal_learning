import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { reset_state } from "../features/question/questionSlice";
import { Exam } from "../types/types";
import { useNavigate } from "react-router-dom";

interface props {
  exam: Exam;
}

const ScoreScreen: React.FC<props> = ({ exam }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <>
      <h1>
        Scored {exam.correctAnswersCount} / {exam.questions.length}
      </h1>
      <div
        className="checked-answer-container"
        style={{ backgroundColor: "green" }}
      >
        <h1>Correct answers</h1>
        {exam.questions.map((question) => {
          return (
            <>
              {question.answer_correct && (
                <>
                  <h4>{question.question_text}</h4>
                  <h2>{question.selected_answer}</h2>
                </>
              )}
            </>
          );
        })}
      </div>
      <div
        className="checked-answer-container"
        style={{ backgroundColor: "red" }}
      >
        <h1>Incorrect answers</h1>
        {exam.questions.map((question) => {
          return (
            <>
              {!question.answer_correct && (
                <>
                  <h4>{question.question_text}</h4>
                  <h2>{question.selected_answer}</h2>
                </>
              )}
            </>
          );
        })}
      </div>
      <button
        onClick={() => {
          dispatch(reset_state());
          navigate("/");
        }}
        className="submit-button"
      >
        Reset
      </button>
    </>
  );
};

export default ScoreScreen;