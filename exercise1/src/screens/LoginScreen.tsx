import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store";
import {
  handle_login_input,
  handle_password_input,
  login,
} from "../features/question/questionSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";

const LoginScreen: React.FC = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.exams);
  const navigate = useNavigate();
  const { loginInput, passwordInput } = state;
  const thunkDispatch = useDispatch<ThunkDispatch<any, any, any>>();

  async function handleLogin() {
    thunkDispatch(
      login({ name: loginInput || "", password: passwordInput || "" })
    );
    /// Move this somewhere else
    navigate("/main");
  }

  function handleRegister(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="login-container">
      <form className="login-form">
        <h2 style={{ color: "white" }}>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={loginInput}
          onChange={(e) =>
            dispatch(handle_login_input({ input: e.target.value }))
          }
          className="login-input"
        />
        <input
          type="passwordInput"
          placeholder="Password"
          value={passwordInput}
          onChange={(e) =>
            dispatch(handle_password_input({ input: e.target.value }))
          }
          className="login-input"
        />
        <button
          type="button"
          onClick={() => handleLogin()}
          className="login-button"
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => handleRegister()}
          className="register-button"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;
