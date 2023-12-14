import React from "react";
import { Question } from "../types/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
  check_answers,
  delete_exam,
  delete_question,
  fetchState,
  select_option,
  start_editing,
} from "../features/question/questionSlice";
import { useNavigate } from "react-router-dom";
import { Exam } from "../types/types";
import { getSelectedExam } from "../utils/getSelectedExam";
import { ThunkDispatch } from "@reduxjs/toolkit";

type ExamScreenProps = {
  exam: Exam;
};

const ExamScreen: React.FC<ExamScreenProps> = ({ exam }) => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.exams);
  const navigate = useNavigate();
  const thunkDispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const isPublished = !!exam.published_at;

  console.log("is published Exam: ", isPublished);

  const allQuestionAnswered =
    exam != undefined &&
    exam.questions.some((question) => !question.selected_answer);

  const handlePublish = async () => {
    console.log("dsasadasdas");
    const data = getSelectedExam(state);
    console.log(data);
    const response = await fetch("https://localhost:3001/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        name: "mikko",
        password: "12345",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    } else {
      dispatch(delete_exam());
      navigate("/");
    }
  };

  const handleDelete = async () => {
    if (!isPublished) {
      dispatch(delete_exam());
      navigate("/");
    } else {
      const response = await fetch(
        `https://localhost:3001/${state.selectedExam}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            name: "mikko",
            password: "12345",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      } else {
        await thunkDispatch(fetchState());
        dispatch(delete_exam());
        navigate("/");
      }
    }
  };

  return (
    <>
      <h2>{exam.name}</h2>
      <div className="row-container-spaceBetween-1">
        <div className="add-question-container">
          <button
            className="back-button-1"
            onClick={() => {
              navigate("/");
            }}
          />
          <h4 style={{ margin: "0px" }}>Exams</h4>
        </div>
        <div className="empty-container" />

        <div className="add-question-container">
          <button
            className="add-button"
            onClick={() => {
              navigate("/exam/create");
            }}
          >
            +
          </button>
          <h4 style={{ margin: "0px" }}>Add Question</h4>
        </div>
      </div>
      <div className="list-box-container">
        <section className="list-box">
          {typeof exam.questions !== "undefined" &&
          exam.questions.length > 0 ? (
            exam.questions.map((question: Question, index: number) => {
              return (
                <div
                  key={"question-box-" + index}
                  style={{
                    color: "black",
                  }}
                  className="list-item"
                >
                  <div
                    key={"row-container-spaceBetween-" + index}
                    className="row-container-spaceBetween"
                  >
                    <p key={"question-text-" + index}>
                      {question.question_text}
                    </p>
                    <div
                      key={"empty-container-" + index}
                      className="empty-container"
                    />
                    <div
                      key={"del-edit-container-" + index}
                      className="del-edit-container"
                    >
                      <button
                        key={"edit-button-" + index}
                        onClick={() => {
                          {
                            dispatch(start_editing({ id: question.id }));
                            navigate("/exam/edit");
                          }
                        }}
                        className="edit-button"
                      ></button>
                      <button
                        key={"delete-button-" + index}
                        className="delete-button"
                        onClick={() =>
                          dispatch(delete_question({ index: index }))
                        }
                      />
                    </div>
                  </div>
                  {question.options.map((option, index) => {
                    return (
                      <button
                        key={"answer-option-button-" + index}
                        style={{
                          backgroundColor:
                            option.answerOptionText === question.selected_answer
                              ? "#15669d"
                              : "#3498db",
                        }}
                        className="option-button"
                        onClick={() =>
                          dispatch(
                            select_option({
                              selectedQuestion: question.id,
                              selected: option.answerOptionText,
                            })
                          )
                        }
                      >
                        {option.answerOptionText}
                      </button>
                    );
                  })}
                </div>
              );
            })
          ) : (
            <p>No items added yet</p>
          )}
        </section>
      </div>
      <div className="row-container-spaceBetween-1">
        <button
          disabled={allQuestionAnswered}
          onClick={() => {
            dispatch(check_answers());
            navigate("/exam/score");
          }}
          style={{
            backgroundColor: allQuestionAnswered ? "grey" : "#3498db",
          }}
          className="submit-questions-button"
        >
          Check Answers
        </button>
        <div className="row-container-spaceBetween">
          <button
            onClick={() => {
              handleDelete();
            }}
            style={{ backgroundColor: "red" }}
            className="submit-button"
          >
            Delete
          </button>
          <button
            onClick={async () => {
              await handlePublish();
            }}
            style={{ backgroundColor: "green" }}
            className="submit-button"
          >
            {isPublished ? "Update" : "Publish"}
          </button>
        </div>
      </div>
    </>
  );
};

export default ExamScreen;
