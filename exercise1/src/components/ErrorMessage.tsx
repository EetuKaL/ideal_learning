import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { set_error_message } from "../features/question/questionSlice";

type ErrorMessageProps = {
  
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({
}) => {
    const error = useSelector((state: RootState) => state.exams.errorMessage);
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
          dispatch(set_error_message({message: null}))
        }
      }, [seconds]);
    

  return (
    <div className="error-message-container">
       <h2 className="error-message">{error}</h2>
    </div>
  );
};

export default ErrorMessage;