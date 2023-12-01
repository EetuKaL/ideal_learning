import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
  create_exam,
  handle_create_exam_input,
} from "../features/question/questionSlice";
import { useNavigate } from "react-router-dom";

const CreateExamPopUp: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state: RootState) => state.exams);
  const toggleCreateExamPopUp = () => {
    setIsOpen(!isOpen);
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(handle_create_exam_input({ input: event.target.value }));
  };

  return (
    <div>
      <button className="add-button" onClick={toggleCreateExamPopUp} />
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={toggleCreateExamPopUp}>
                &times;
              </span>
              <h2>Exam name? </h2>
              <div className="pop-up-input-container">
                <input
                  value={state.create_exam_input_value}
                  onChange={handleInput}
                  type="text"
                  className="input-field"
                ></input>
                <button
                  className="add-button"
                  onClick={() => {
                    dispatch(create_exam());
                    toggleCreateExamPopUp();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateExamPopUp;
