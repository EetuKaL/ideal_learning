import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
  add_answer_option,
  add_question,
  clear_create_question_state,
  delete_answer_option,
  handle_add_answer_input,
  handle_create_question_input,
  select_correct_option,
} from "../features/question/questionSlice";
import { useNavigate } from "react-router-dom";
import { Exam } from "../types/types";

interface props {
  exam: Exam;
}

const QuestionScreen: React.FC<props> = ({ exam }) => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.exams);
  const {
    answer_options,
    correct_answer,
    question_text,
    createQuestionInput,
    addOptionsInput,
  } = state.createQuestion;
  const isAddButtonEnabled =
    question_text.length > 3 && answer_options.length > 1 && correct_answer;

  const titleText = state.createQuestion.id
    ? "Edit question"
    : "Create new question";

  const navigate = useNavigate();

  const handleCreateQuestionInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(handle_create_question_input({ input: event.target.value }));
  };
  function handleAddOptionsInput(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    dispatch(handle_add_answer_input({ input: event.target.value }));
  }
  const handleBackButton = () => {
    dispatch(clear_create_question_state());
    navigate("/exam");
  };

  return (
    <>
      <div className="back-button-container">
        <button
          onClick={() => handleBackButton()}
          className="back-button"
        ></button>
      </div>
      <h1>{titleText}</h1>
      <h3>What is the question?</h3>
      <input
        className="input-field"
        value={createQuestionInput}
        onChange={handleCreateQuestionInput}
        type="text"
      ></input>
      <h3>Add options for the answer</h3>
      <div className="row-container">
        <input
          className="input-field"
          value={addOptionsInput}
          onChange={handleAddOptionsInput}
          type="text"
        ></input>
        <button
          className="add-list-button"
          onClick={() => dispatch(add_answer_option())}
        />
      </div>
      <h2>What is the correct answer?</h2>
      <h3>{question_text}</h3>
      <div className="row-container">
        {answer_options.map((answer, index) => {
          return (
            <div className="option-button-container">
              <button
                style={{
                  backgroundColor:
                    correct_answer === answer ? "green" : "#3498db",
                }}
                onClick={() =>
                  dispatch(select_correct_option({ index: index }))
                }
                className="option-button-review"
              >
                {answer}
              </button>
              <button
                className="review-delete-button"
                onClick={() => dispatch(delete_answer_option({ index: index }))}
              ></button>
            </div>
          );
        })}
      </div>
      <button
        onClick={() => dispatch(add_question({ id: state.createQuestion.id }))}
        disabled={!isAddButtonEnabled}
        style={{
          marginTop: "100px",
          backgroundColor: isAddButtonEnabled ? "green" : "grey",
        }}
        className="submit-button"
      >
        {state.createQuestion.id ? "Change" : "Add"}
      </button>
    </>
  );
};

export default QuestionScreen;
