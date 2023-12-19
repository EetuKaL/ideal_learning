import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";
import { select_exam } from "../features/question/questionSlice";
import CreateExamPopUp from "../components/CreateExamPopUp";

const MainScreen: React.FC = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.exams);
  const navigate = useNavigate();

  function handleSignOut(): void {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div>
      {state.isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <button onClick={() => handleSignOut()} className="signout-btn">
            Sign out
          </button>
          <div className="row-container">
            <h2>Create exam</h2>
            <CreateExamPopUp />
          </div>
          <h1>Next exams are available:</h1>
          {state.exams?.map((exam, index) => {
            return (
              <div key={"column-" + index} className="column-container">
                <div key={"row-" + index} className="row-container">
                  <button
                    key={"exam-button" + index}
                    className="submit-button"
                    onClick={() => {
                      dispatch(select_exam({ selectedExamId: exam.examId }));
                      navigate("exam/");
                    }}
                  >
                    {exam.name}
                  </button>
                  <div
                    key={"color-indicator-" + index}
                    style={{
                      backgroundColor: exam.published_at ? "green" : "red",
                    }}
                    className={"status-indicator"}
                  ></div>
                  <h4 key={"status-indicator-text" + index}>
                    {exam.published_at ? "Published" : "Not Published"}
                  </h4>
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
