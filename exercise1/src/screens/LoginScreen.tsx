import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store";
import {
  handle_LastName_input,
  handle_email_input,
  handle_firstName_input,
  handle_passwordAgain_input,
  handle_password_input,
  login,
  register,
  set_error_message,
  swich_between_login_register,
} from "../features/question/questionSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";

const LoginScreen: React.FC = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.exams);
  const navigate = useNavigate();
  const {
    emailInput,
    passwordInput,
    passwordAgainInput,
    firstNameInput,
    lastNameInput,
  } = state;
  const thunkDispatch = useDispatch<ThunkDispatch<any, any, any>>();

  async function handleLogin() {
    console.log("login");
    try {
      await thunkDispatch(
        login({ name: emailInput || "", password: passwordInput || "" })
      );
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  useEffect(() => {
    dispatch(handle_LastName_input({ input: "" }));
    dispatch(handle_firstName_input({ input: "" }));
    dispatch(handle_passwordAgain_input({ input: "" }));
  }, []);

  //// CREATE REGISTER METHOD LATER
  async function handleRegister() {
    try {
      if (passwordsMatch()) {
        await thunkDispatch(
          register({
            email: emailInput || "",
            password: passwordInput || "",
            firstName: firstNameInput,
            lastName: lastNameInput,
          })
        );
      }
    } catch (error) {
      console.error("Register failed:", error);
    }
  }

  const passwordsMatch = () => {
    if (passwordInput === passwordAgainInput) {
      return true;
    } else {
      dispatch(set_error_message({ message: "Passwords doesn't match" }));
      return false;
    }
  };

  return (
    <div className="login-container">
      <form className="login-form">
        <h1 style={{ color: "white" }}>
          {state.isLogingIn ? "Login" : "Register"}
        </h1>
        <div className="login-input-container">
          <p style={{ color: "white" }}>Email</p>
          <input
            type="text"
            placeholder="Email"
            value={emailInput}
            onChange={(e) =>
              dispatch(handle_email_input({ input: e.target.value }))
            }
            className="login-input"
          />
        </div>
        <div className="login-input-container">
          <p style={{ color: "white" }}>Password</p>
          <input
            type="password"
            placeholder="Password"
            value={passwordInput}
            onChange={(e) =>
              dispatch(handle_password_input({ input: e.target.value }))
            }
            className="login-input"
          />
        </div>
        {!state.isLogingIn && (
          <div className="login-input-container">
            <p style={{ color: "white" }}>Password again</p>
            <input
              type="password"
              placeholder="Password"
              value={passwordAgainInput}
              onChange={(e) =>
                dispatch(handle_passwordAgain_input({ input: e.target.value }))
              }
              className="login-input"
            />
          </div>
        )}
        {!state.isLogingIn && (
          <div className="login-input-container">
            <p style={{ color: "white" }}>First name (optional)</p>
            <input
              type="firstNameInput"
              placeholder="First name"
              value={firstNameInput}
              onChange={(e) =>
                dispatch(handle_firstName_input({ input: e.target.value }))
              }
              className="login-input"
            />
          </div>
        )}
        {!state.isLogingIn && (
          <div className="login-input-container">
            <p style={{ color: "white" }}>Last name (optional)</p>
            <input
              type="lastNameInput"
              placeholder="Last name"
              value={lastNameInput}
              onChange={(e) =>
                dispatch(handle_LastName_input({ input: e.target.value }))
              }
              className="login-input"
            />
          </div>
        )}
        <div style={{ marginTop: "15px" }}>
          <button
            type="button"
            onClick={async () =>
              state.isLogingIn ? await handleLogin() : await handleRegister()
            }
            className="login-button"
          >
            {state.isLogingIn ? "Login" : "Register"}
          </button>
          <button
            type="button"
            onClick={() =>
              dispatch(
                swich_between_login_register({ isLoginIn: !state.isLogingIn })
              )
            }
            className="register-button"
          >
            {state.isLogingIn ? "Register instead" : "Login instead"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginScreen;
