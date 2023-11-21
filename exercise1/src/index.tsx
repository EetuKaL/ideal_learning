import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import reportWebVitals from './reportWebVitals.js';
import store  from './store.tsx'
import { Provider } from 'react-redux'

const rootElement = document.getElementById('root')
const root = rootElement ? ReactDOM.createRoot(rootElement) : null
root?.render(
    <StrictMode>
     <Provider store={store}>
    <App />
    </Provider>
    </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
