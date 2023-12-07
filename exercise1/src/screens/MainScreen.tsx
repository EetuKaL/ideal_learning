import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { Link, useNavigate } from "react-router-dom";
import { create_exam, select_exam } from "../features/question/questionSlice";
import CreateExamPopUp from "../components/CreateExamPopUp";

const MainScreen: React.FC = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.exams);
  const navigate = useNavigate();
  console.log("is loading:  ", state.isLoading);
  return (
    <div>
      {state.isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="row-container">
            <h2>Create exam</h2>
            <CreateExamPopUp />
          </div>
          <h1>Next exams are available:</h1>
          {state.exams?.map((exam) => {
            return (
              <div className="column-container">
                <div className="row-container">
                <button
                  className="submit-button"
                  onClick={() => {
                    dispatch(select_exam({ selectedExamId: exam.examId }));
                    navigate("exam/");
                  }}
                >
                  Exam {exam.name}
                </button>
                <div style={{backgroundColor: exam.published_at ? 'green' : 'red'}} className={'status-indicator'}></div>
                <h4>{exam.published_at ? 'Published' : 'Not Published'}</h4>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default MainScreen;
