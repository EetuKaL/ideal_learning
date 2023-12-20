import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Redirect: React.FC = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(5);

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
      navigate("/");
    }
  }, [seconds]);

  return (
    <div>
      <h2>Not found</h2>
      <h4>Redirecting back to main screen in {seconds} seconds...</h4>
    </div>
  );
};

export default Redirect;
