import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { set_success_message } from "../features/question/questionSlice";

type SuccessMessageProps = {};

const SuccessMessage: React.FC<SuccessMessageProps> = ({}) => {
  const success = useSelector((state: RootState) => state.exams.successMessage);
  const [seconds, setSeconds] = useState(3);
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 1) {
          clearInterval(interval);
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      dispatch(set_success_message({ message: null }));
    }
  }, [seconds]);

  return (
    <div className="succcess-message-container">
      <h2 className="message">{success}</h2>
    </div>
  );
};

export default SuccessMessage;
