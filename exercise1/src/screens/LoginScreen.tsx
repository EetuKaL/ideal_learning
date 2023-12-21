import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store";
import {
  handle_login_input,
  handle_password_input,
  login,
  swich_between_login_register,
} from "../features/question/questionSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import ErrorMessage from "../components/ErrorMessage";

const LoginScreen: React.FC = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.exams);
  const navigate = useNavigate();
  const { loginInput, passwordInput } = state;
  const thunkDispatch = useDispatch<ThunkDispatch<any, any, any>>();

  async function handleLogin() {
    console.log('login');
    try {
      await thunkDispatch(
        login({ name: loginInput || "", password: passwordInput || "" })
      );
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  //// CREATE REGISTER METHOD LATER
  async function handleRegister() {
    console.log('register');
    
    const response = await fetch("https://localhost:3001/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({'user_email': state.loginInput, 'user_password': state.passwordInput}),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    } else {
      dispatch(swich_between_login_register({isLoginIn: true}));
      
    }
  };
  console.log(state.isLogingIn)

  return (
    <div className="login-container">
      {state.errorMessage && <ErrorMessage />}
      <form className="login-form">
        <h1 style={{ color: "white" }}>{state.isLogingIn ? 'Login' : 'Register'}</h1>
        <div className="login-input-container">
          <p style={{color: 'white'}}>Email</p>
          <input
          type="text"
          placeholder="Email"
          value={loginInput}
          onChange={(e) =>
            dispatch(handle_login_input({ input: e.target.value }))
          }
          className="login-input"
        /></div>
        <div className="login-input-container">
          <p style={{color: 'white'}}>Password</p>
          <input
          type="passwordInput"
          placeholder="Password"
          value={passwordInput}
          onChange={(e) =>
            dispatch(handle_password_input({ input: e.target.value }))
          }
          className="login-input"
        /></div >
        {!state.isLogingIn && <div className="login-input-container">
          <p style={{color: 'white'}}>First name (optional)</p>
          <input
          type="lastNameInput"
          placeholder="First name"
          value={passwordInput}
          onChange={(e) =>
            dispatch(handle_password_input({ input: e.target.value }))
          }
          className="login-input"
        /></div>}
        {!state.isLogingIn && <div className="login-input-container">
          <p style={{color: 'white'}}>Last name (optional)</p>
          <input
          type="lastNameInput"
          placeholder="Last name"
          value={passwordInput}
          onChange={(e) =>
            dispatch(handle_password_input({ input: e.target.value }))
          }
          className="login-input"
        /></div>}
        <div style={{'marginTop' : '15px'}}>
        <button
          type="button"
          onClick={async () => state.isLogingIn ? await handleLogin() : await handleRegister()}
          className="login-button"
        >
          {state.isLogingIn ? 'Login' : 'Register'}
        </button>
        <button
          type="button"
          onClick={() => dispatch(swich_between_login_register({isLoginIn: !state.isLogingIn}))}
          className="register-button"
        >
          {state.isLogingIn ? 'Register instead' : 'Login instead'}
        </button>
        </div>
      </form>
    </div>
  );
};

export default LoginScreen;
